class ImportAtmavio < ApplicationRecord
  GPX_URL_NAV_POINTS = 'https://oc.atmavio.pl/index.php/s/UVlhkwKVmTb2lHm/download'.freeze

  NAV_POINT_KIND_MAP = {
    'Lądowisko zarejestrowane' => :uncontrolled,
    'Polecone zagraniczne' => :uncontrolled,
    'Lotnisko' => :uncontrolled,
    'Lotnisko wojskowe' => :military,
    'Lotnisko kontrolowane' => :controlled,
    'Lądowisko' => :airstrip,
    'Drogowy Odcinek Lotniskowy' => :other_airstrip,
    'Lądowisko trudne' => :other_airstrip,
    'Lądowisko niepotwierdzone' => :other_airstrip
  }.freeze

  NAV_AID_KIND_MAP = {
    12 => :ndb,
    13 => :vor,
    14 => :vor_dme,
    15 => :vor_dme,
    16 => :dme,
    17 => :vor,
    18 => :ndb
  }.freeze

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
    '#NWAPunkt' => :other,
    '#RMZ' => :rmz,
    '#ROL' => :ea,
    '#EA' => :ea,
    '#TFR' => :tfr,
    '#TMA' => :tma,
    '#TRA' => :tra,
    '#TSA' => :tsa
  }.freeze

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
    '#TSA' => false
  }.freeze

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
    logger = Logger.new(STDOUT)
    logger.info("Started at #{Time.zone.now}")
    kml_path = File.join(import_directory, 'Lotniska.kml')

    logger.info('Processing airport list')
    xml = Nokogiri::XML(File.open(kml_path))
    xml.xpath('//xmlns:Folder/xmlns:name[contains(text(), "Lotniska i lądowiska")]/../xmlns:Placemark').each do |placemark|
      logger.info('================')
      name = placemark.xpath('./xmlns:name').text.strip
      logger.info(name)
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
      nav_point.declination = MagDeclination.get_declination nav_point
      nav_point.active!
      # puts nav_point.to_json

      nav_point.description = description
      nav_point.save
      sleep 0.05
    end

    logger.info("Finished at #{Time.zone.now}")
  end

  ##
  # Example: echo 'ImportAtmavio.import_airspaces_all("/some/path/vfr-planner/import")' | bundle exec rails console
  #
  def self.import_airspaces_all(import_directory)
    logger = Logger.new(STDOUT)
    logger.info("Started at #{Time.zone.now}")
    Airspace.destroy_all(country: 'pl')
    kml_path = File.join(import_directory, 'Strefy wszystkie.kml')
    logger.info('Processing airspaces list')
    xml = Nokogiri::XML(File.open(kml_path))
    xml.xpath('//xmlns:Folder/xmlns:Placemark').each do |placemark|
      logger.info('================')
      description = placemark.xpath('./xmlns:description').text.strip
      style_url = placemark.xpath('.//xmlns:styleUrl').text.strip

      levels_raw, description = description.split("\n", 2)
      level_min, level_max = levels_raw.split(',').map { |a| a.gsub(/\D/, '').to_i }

      airspace = Airspace.new
      airspace.name = placemark.xpath('./xmlns:name').text.strip
      airspace.description = description
      airspace.level_min = level_min
      airspace.level_max = level_max
      airspace.country = 'pl'
      airspace.points = placemark.xpath('.//xmlns:coordinates').text.strip
      airspace.kind = AIRSPACE_KIND_MAP[style_url] || :other
      airspace.permanent = AIRSPACE_PERMANENT_MAP[style_url]

      logger.info(airspace.name)
      airspace.save
    end
    logger.info("Finished at #{Time.zone.now}")
  end

  ##
  # Example: echo 'ImportAtmavio.import_airspaces_active("/some/path/vfr-planner/import")' | bundle exec rails console
  #
  def self.import_airspaces_active(import_directory)
    logger = Logger.new(STDOUT)
    logger.info("Started at #{Time.zone.now}")
    ActiveAirspace.destroy_all(country: 'pl')
    today_file = "Strefy_AUP_#{Time.zone.today.strftime('%Y-%m-%d')}.kml"
    tomorrow_file = "Strefy_AUP_#{Time.zone.tomorrow.strftime('%Y-%m-%d')}.kml"
    import_airspaces_active_for_day(:today, File.join(import_directory, today_file), logger)
    import_airspaces_active_for_day(:tomorrow, File.join(import_directory, tomorrow_file), logger)
    logger.info("Finished at #{Time.zone.now}")
  end

  def self.import_airspaces_active_for_day(day, kml_path, logger)
    unless File.exist? kml_path
      logger.error("KML file for #{day} does not exist (#{kml_path})")
      return
    end
    xml = Nokogiri::XML(File.open(kml_path))
    xml.xpath('//xmlns:Folder/xmlns:Placemark').each do |placemark|
      name = placemark.xpath('./xmlns:name').text.strip
      description = placemark.xpath('./xmlns:description').text.strip
      logger.info('===============')
      logger.info(name)

      airspace = Airspace.find_by_name name
      unless airspace
        logger.error("Airspace with given name (#{name}) not found, skipping.")
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
      level_max: 999_999
    }

    # Min: 0 ft, Max: 1500 ft
    matches = description.match(/Min: (\d+) ft, Max: (\d+) ft/)
    if matches
      o[:level_min] = matches[1].to_i
      o[:level_max] = matches[2].to_i
    end

    # 14 JUN 18:00 2017 UNTIL 18 JUN 16:00 2017
    matches = description.match(/(\d\d [A-Z]{3} [^U]+) UNTIL (\d\d [A-Z]{3} \d\d:\d\d \d{4})/)
    if matches
      time_from = Time.zone.parse(matches[1])
      time_to = Time.zone.parse(matches[2])
      o[:time_from] = time_from.hour * 100 + time_from.min if time_from > Time.zone.today
      o[:time_to] = time_to.hour * 100 + time_to.min if time_to < Time.zone.tomorrow
    end
    [o]
  end

  ##
  # Example: echo 'ImportAtmavio.import_nav_aids("/some/path/vfr-planner/import")' | bundle exec rails console
  #
  def self.import_nav_aids(import_directory)
    logger = Logger.new(STDOUT)
    logger.info("Started at #{Time.zone.now}")
    xml_path = File.join(import_directory, 'nav_aids.xml')
    logger.info('Processing VFR point list')
    xml = Nokogiri::XML(File.open(xml_path))
    NavPoint.where(kind: [:vor, :ndb, :vor_dme, :dme]).where(country: 'pl').delete_all
    xml.xpath('//table_data/row').each do |row|
      logger.info('=================')

      lat = row.xpath('./field[@name="lat"]').text.strip.to_f
      lng = row.xpath('./field[@name="lng"]').text.strip.to_f
      type = row.xpath('./field[@name="type"]').text.strip.to_i
      nav_point = NavPoint.find_for_lat_lng(lat, lng)

      nav_point.name = row.xpath('./field[@name="icao_code"]').text.strip
      nav_point.radio = row.xpath('./field[@name="radio"]').text.strip
      nav_point.description = row.xpath('./field[@name="name"]').text.strip + '<br />' + nav_point.radio
      nav_point.kind = NAV_AID_KIND_MAP[type]
      nav_point.country = 'pl'
      nav_point.declination = MagDeclination.get_declination nav_point
      nav_point.active!
      nav_point.save

      logger.info(nav_point.name)
    end
    logger.info("Finished at #{Time.zone.now}")
  end

  ##
  # Example: echo 'ImportAtmavio.import_vfr_points("/some/path/vfr-planner/import")' | bundle exec rails console
  #
  def self.import_vfr_points(import_directory)
    logger = Logger.new(STDOUT)
    logger.info("Started at #{Time.zone.now}")
    gpx_path = File.join(import_directory, 'Punkty VFR.gpx')
    logger.info('Processing VFR point list')
    xml = Nokogiri::XML(File.open(gpx_path))
    NavPoint.where(kind: :vfr_point).where(country: 'pl').delete_all
    xml.xpath('//xmlns:gpx/xmlns:wpt').each do |wpt|
      name = wpt.xpath('./xmlns:name').text.strip
      logger.info('=================')
      logger.info(name)
      lat = wpt[:lat].to_f
      lng = wpt[:lon].to_f

      nav_point = NavPoint.find_for_lat_lng(lat, lng)
      nav_point.name = name
      nav_point.kind = :vfr_point

      nav_point.country = 'pl'
      nav_point.declination = MagDeclination.get_declination nav_point
      nav_point.active!

      nav_point.save
    end
    logger.info("Finished at #{Time.zone.now}")
  end

  ##
  # Example: echo 'ImportAtmavio.import_ifr_points("/some/path/vfr-planner/import")' | bundle exec rails console
  #
  def self.import_ifr_points(import_directory)
    logger = Logger.new(STDOUT)
    logger.info("Started at #{Time.zone.now}")
    txt_path = File.join(import_directory, 'Punkty IFR.txt')
    NavPoint.where(kind: :ifr_point).where(country: 'pl').delete_all
    require 'lat_lng'
    File.readlines(txt_path).each do |line|
      name, lat_s, lng_s, _rest = line.split(' ', 4)
      p = LatLng.build_from_strings(lat_s, lng_s)
      logger.info("#{name} #{p.lat} #{p.lng}")

      nav_point = NavPoint.find_for_lat_lng(p.lat, p.lng)
      nav_point.name = name
      nav_point.kind = :ifr_point

      nav_point.country = 'pl'
      nav_point.declination = MagDeclination.get_declination nav_point
      nav_point.active!

      nav_point.save
    end
    logger.info("Finished at #{Time.zone.now}")
  end
end
