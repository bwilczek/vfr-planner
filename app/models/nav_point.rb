require 'fileutils'
require 'zip'
require 'pp'

class NavPoint < ApplicationRecord
  enum kind: [:controlled, :uncontrolled, :military, :airstrip, :helipad, :vfr_point, :ifr_point, :vor, :ndb, :vor_dme, :dme]
  enum status: [:active, :inactive]

  GPX_URL_NAV_POINTS = 'https://oc.atmavio.pl/index.php/s/UVlhkwKVmTb2lHm/download'

  def self.import_atmavio_airports(import_directory)
    puts "Started at #{Time.now}"
    kml_path = File.join(import_directory, 'LotniskaPL-KML.kml')

    puts "Processing airport list"
    xml = Nokogiri::XML(File.open(kml_path))
    xml.xpath('//xmlns:Folder/xmlns:name[contains(text(), "Lotniska i lądowiska")]/../xmlns:Placemark').each do |placemark|
      name = placemark.xpath('./xmlns:name').text.strip
      lng, lat = placemark.xpath('./xmlns:Point/xmlns:coordinates').text.strip.split(',')
      description = placemark.xpath('./xmlns:description').text.strip
      pp description.split('<br>')

      # "Status: Lądowisko zarejestrowane; ",
      # "ICAO: EPZE; ",
      # "Radio: Krzesiny-Tower 121.025; ",
      # "Elewacja: 261 ft; ",
      # "Link: http://www.airport-biernat.pl/; ",

      puts "#{name} #{lat} #{lng}"
      # TODO: extract radio, kind, elevation, icao_code, country from description
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
