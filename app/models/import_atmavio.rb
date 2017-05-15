class ImportAtmavio < ApplicationRecord

  GPX_URL_NAV_POINTS = 'https://oc.atmavio.pl/index.php/s/UVlhkwKVmTb2lHm/download'

  STATUS_MAP = {
    'Lądowisko zarejestrowane' => :uncontrolled,
    'Lotnisko wojskowe' => :military,
    'Lotnisko kontrolowane' => :controlled,
    'Lądowisko' => :airstrip,
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
      nav_point.kind = STATUS_MAP[value]
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
      lng, lat = placemark.xpath('./xmlns:Point/xmlns:coordinates').text.strip.split(',')
      nav_point = NavPoint.find_for_lat_lng(lat, lng)
      nav_point.name = name

      description = placemark.xpath('./xmlns:description').text.strip
      description.split('<br>').each do |line|
        key, value = line.split(':', 2)
        parse_and_set_atmavio_property(nav_point, key, value)
      end

      # nav_point.description = description
      # TODO: set country and status

      puts nav_point.to_json
    end

    puts "Finished at #{Time.now}"
  end

  def self.import_atmavio_vfr_points
    puts "Started at #{Time.now}"
    puts "Downloading #{GPX_URL_NAV_POINTS}"
    puts "Finished at #{Time.now}"
  end

end
