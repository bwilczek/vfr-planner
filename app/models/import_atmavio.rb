class ImportAtmavio < ApplicationRecord

  GPX_URL_NAV_POINTS = 'https://oc.atmavio.pl/index.php/s/UVlhkwKVmTb2lHm/download'

  NAV_POINT_KIND_MAP = {
    'Lądowisko zarejestrowane' => :uncontrolled,
    'Polecone zagraniczne' => :uncontrolled,
    'Lotnisko' => :uncontrolled,
    'Lotnisko wojskowe' => :military,
    'Lotnisko kontrolowane' => :controlled,
    'Lądowisko' => :airstrip,
    'Drogowy Odcinek Lotniskowy' => :other_airstrip,
    'Lądowisko trudne' => :other_airstrip,
    'Lądowisko niepotwierdzone' => :other_airstrip,
  }

  AIRSPACE_KIND_MAP = {
    '#AAA' => :other,
    '#ADIZ' => :adiz,
    '#ATZ' => :atz,
    '#CTR' => :ctr,
    '#EPD' => :danger,
    '#EPP' => :prohibited,
    '#EPR' => :restricted,
    '#FIS' => :fis,
    '#MATZ' => :matz,
    '#Miejscowość' => :notam_point,
    '#MRT' => :mrt,
    '#NWA' => :other,
    '#RMZ' => :rmz,
    '#ROL' => :ea,
    '#TFR' => :tfr,
    '#TMA' => :tma,
    '#TRA' => :tra,
    '#TSA' => :tsa,
  }

  AIRSPACE_PERMANENT_MAP = {
    '#AAA' => false,
    '#ADIZ' => true,
    '#ATZ' => false,
    '#CTR' => true,
    '#EPD' => false,
    '#EPP' => true,
    '#EPR' => true,
    '#FIS' => true,
    '#MATZ' => false,
    '#Miejscowość' => false,
    '#MRT' => false,
    '#NWA' => false,
    '#RMZ' => false,
    '#ROL' => false,
    '#TFR' => false,
    '#TMA' => true,
    '#TRA' => false,
    '#TSA' => false,
  }

  def self.parse_and_set_atmavio_property(nav_point, key, value)
    key.strip!
    value.strip!
    value.gsub!(/\s*;\s*\Z/, '')
    case key
    when 'ICAO'
      nav_point.icao_code = value
    when 'Elewacja'
      nav_point.elevation = value
    when 'Radio'
      nav_point.radio = value
    when 'Status'
      nav_point.kind = NAV_POINT_KIND_MAP[value]
    end
  end

  ##
  # Example: echo 'ImportAtmavio.import_airports("/some/path/vfr-planner/import")' | bundle exec rails console
  #
  def self.import_airports(import_directory)
    puts "Started at #{Time.now}"
    kml_path = File.join(import_directory, 'Lotniska.kml')

    puts "Processing airport list"
    xml = Nokogiri::XML(File.open(kml_path))
    xml.xpath('//xmlns:Folder/xmlns:name[contains(text(), "Lotniska i lądowiska")]/../xmlns:Placemark').each do |placemark|
      puts "================"
      name = placemark.xpath('./xmlns:name').text.strip
      puts name
      lng, lat = placemark.xpath('./xmlns:Point/xmlns:coordinates').text.strip.split(',')
      lng = lng.to_f
      lat = lat.to_f
      nav_point = NavPoint.find_for_lat_lng(lat, lng)
      nav_point.name = name

      description = placemark.xpath('./xmlns:description').text.strip
      description.split('<br>').each do |line|
        key, value = line.split(':', 2)
        parse_and_set_atmavio_property(nav_point, key, value)
      end

      nav_point.compute_country_code
      nav_point.active!
      # puts nav_point.to_json

      nav_point.description = description
      nav_point.save
      sleep 0.05
    end

    puts "Finished at #{Time.now}"
  end

  ##
  # Example: echo 'ImportAtmavio.import_airspaces_all("/some/path/vfr-planner/import")' | bundle exec rails console
  #
  def self.import_airspaces_all(import_directory)
    puts "Started at #{Time.now}"
    Airspace.destroy_all(country: 'pl')
    kml_path = File.join(import_directory, 'Strefy wszystkie.kml')
    puts "Processing airspaces list"
    xml = Nokogiri::XML(File.open(kml_path))
    xml.xpath('//xmlns:Folder/xmlns:Placemark').each do |placemark|
      puts "================"
      description = placemark.xpath('./xmlns:description').text.strip
      style_url = placemark.xpath('.//xmlns:styleUrl').text.strip

      levels_raw, description = description.split("\n", 2)
      level_min, level_max = levels_raw.split(',').map{|a| a.gsub(/\D/, '').to_i}

      airspace = Airspace.new
      airspace.name = placemark.xpath('./xmlns:name').text.strip
      airspace.description = description
      airspace.level_min = level_min
      airspace.level_max = level_max
      airspace.country = 'pl'
      airspace.points = placemark.xpath('.//xmlns:coordinates').text.strip
      airspace.kind = AIRSPACE_KIND_MAP[style_url]
      airspace.permanent = AIRSPACE_PERMANENT_MAP[style_url]

      puts airspace.name
      airspace.save
    end
    puts "Finished at #{Time.now}"
  end

  ##
  # Example: echo 'ImportAtmavio.import_airspaces_active("/some/path/vfr-planner/import")' | bundle exec rails console
  #
  def self.import_airspaces_active(import_directory)
    puts "Started at #{Time.now}"
    ActiveAirspace.destroy_all(country: 'pl')
    today_file = "Strefy_AUP_#{Date.today.strftime("%Y-%m-%d")}.kml"
    tomorrow_file = "Strefy_AUP_#{Date.tomorrow.strftime("%Y-%m-%d")}.kml"
    import_airspaces_active_for_day(:today, File.join(import_directory, today_file))
    import_airspaces_active_for_day(:tomorrow, File.join(import_directory, tomorrow_file))
  end

  def self.import_airspaces_active_for_day(day, kml_path)
    unless File.exists? kml_path
      STDERR.puts "KML file for #{day} does not exist (#{kml_path})"
      return
    end
    xml = Nokogiri::XML(File.open(kml_path))
    xml.xpath('//xmlns:Folder/xmlns:Placemark').each do |placemark|
      name = placemark.xpath('./xmlns:name').text.strip
      description = placemark.xpath('./xmlns:description').text.strip
      puts "==============="
      puts name

      airspace = Airspace.find_by_name name
      unless airspace
        STDERR.puts "Airspace with given name (#{name}) not found, skipping."
        next
      end

      hours_and_levels = parse_active_airspace_description(description)
      hours_and_levels.each do |limits|
        active_airspace = ActiveAirspace.new
        active_airspace.airspace = airspace
        active_airspace.country = 'pl'
        active_airspace.day = day
        active_airspace.extra_description = description
        active_airspace.time_from = limits[:time_from]
        active_airspace.time_to = limits[:time_to]
        active_airspace.level_min = limits[:level_min]
        active_airspace.level_max = limits[:level_max]
        active_airspace.save
      end

    end
    puts "Finished at #{Time.now}"
  end

  def self.parse_active_airspace_description(description)
    ret = []

    # - od 00:00 do 05:30 wys. 0-1500 ft
    # - od 06:00 do 24:00 wys. 0-1500 ft
    r = /od (?<hour_from>\d+):(?<minute_from>\d+) do (?<hour_to>\d+):(?<minute_to>\d+) wys. (?<level_min>\d+)-(?<level_max>\d+) ft/
    matches = description.scan(r)
    unless matches.empty?
      matches.each do |row|
        row.map!(&:to_i)
        o = {
          time_from: row[0] * 100 + row[1],
          time_to: row[2] * 100 + row[3],
          level_min: row[4],
          level_max: row[5]
        }
        ret << o
      end
      return ret
    end

    o = {
      time_from: 0,
      time_to: 2359,
      level_min: 0,
      level_max: 999999
    }

    # Min: 0 ft, Max: 1500 ft
    if matches = description.match(/Min: (\d+) ft, Max: (\d+) ft/)
      o[:level_min] = matches[1].to_i
      o[:level_max] = matches[2].to_i
    end

    # 14 JUN 18:00 2017 UNTIL 18 JUN 16:00 2017
    if matches = description.match(/(\d\d [A-Z]{3} [^U]+) UNTIL (\d\d [A-Z]{3} \d\d:\d\d \d{4})/)
      time_from = DateTime.parse(matches[1])
      time_to = DateTime.parse(matches[2])
      o[:time_from] = time_from.hour * 100 + time_from.minute if time_from > Date.today
      o[:time_to] = time_to.hour * 100 + time_to.minute if time_to < Date.tomorrow
    end
    [o]
  end

  def self.import_atmavio_vfr_points
    puts "Started at #{Time.now}"
    puts "Downloading #{GPX_URL_NAV_POINTS}"
    puts "Finished at #{Time.now}"
  end

end
