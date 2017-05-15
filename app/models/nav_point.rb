require 'fileutils'
require 'zip'
require 'pp'

class NavPoint < ApplicationRecord
  enum kind: [:controlled, :uncontrolled, :military, :airstrip, :helipad, :vfr_point, :ifr_point, :vor, :ndb, :vor_dme, :dme]
  enum status: [:active, :inactive]

  GPX_URL_NAV_POINTS = 'https://oc.atmavio.pl/index.php/s/UVlhkwKVmTb2lHm/download'

  STATUS_MAP = {
    'Lądowisko zarejestrowane' => :uncontrolled,
    'Lotnisko wojskowe' => :military,
    'Lotnisko kontrolowane' => :controlled,
    'Lądowisko' => :airstrip,
  }

  def self.find_for_lat_lng(lat, lng)
    # TODO: fetch NavPoint if exists for given location, otherwise new instance
    NavPoint.new(lat: lat, lng: lng)
  end

  def parse_and_set_atmavio_property(key, value)
    key.strip!
    value.strip!
    value.gsub!(/\s*;\s*\Z/, '')
    case key
    when 'ICAO'
      self.icao_code = value
    when 'Elewacja'
      self.elevation = value
    when 'Radio'
      self.radio = value
    when 'Status'
      self.kind = STATUS_MAP[value]
    end
  end

  def self.import_atmavio_airports(kml_file_name)
    puts "Started at #{Time.now}"
    import_directory = File.join(Rails.root, 'import')
    kml_path = File.join(import_directory, kml_file_name)

    puts "Processing airport list"
    xml = Nokogiri::XML(File.open(kml_path))
    xml.xpath('//xmlns:Folder/xmlns:name[contains(text(), "Lotniska i lądowiska")]/../xmlns:Placemark').each do |placemark|
      puts "================"
      name = placemark.xpath('./xmlns:name').text.strip
      lng, lat = placemark.xpath('./xmlns:Point/xmlns:coordinates').text.strip.split(',')
      nav_point = find_for_lat_lng(lat, lng)
      nav_point.name = name

      description = placemark.xpath('./xmlns:description').text.strip
      description.split('<br>').each do |line|
        key, value = line.split(':', 2)
        nav_point.parse_and_set_atmavio_property(key, value)
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

  def self.get_country_code(location)
    data = fetch_geocode(location)
    return data['results'].first['address_components'].select{|item| item['types'].include?('country') }.first['short_name'].downcase
  end

  def self.get_name(location)
    data = fetch_geocode(location)
    return data['results'].first['address_components'].select {|item| item['types'].include?('political') }.first['short_name']
  end

  def self.fetch_geocode(location)
    response = Faraday.get "https://maps.googleapis.com/maps/api/geocode/json?latlng=#{location.lat},#{location.lng}"
    JSON.parse(response.body)
  end

end
