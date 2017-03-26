require 'fileutils'
require 'zip'

class NavPoint < ApplicationRecord
  enum kind: [:controlled, :uncontrolled, :military, :airstrip, :helipad, :vfr_point, :ifr_point, :vor, :ndb, :vor_dme, :dme]
  enum status: [:active, :inactive]

  KML_URL_AIRPORTS = 'https://www.google.com/maps/d/kml?mid=1STEikPe5IwRNA84Q6OQEnzbui0c&lid=rgdvzPL49Xo'
  GPX_URL_NAV_POINTS = 'https://oc.atmavio.pl/index.php/s/UVlhkwKVmTb2lHm/download'

  def self.import_atmavio_airports
    puts "Started at #{Time.now}"
    # import_directory = Rails.root.join('tmp', 'import', "airports_#{Time.now.strftime('%Y_%m_%d_%H%M%S')}")
    import_directory = Rails.root.join('tmp', 'import', 'workinprogress')
    FileUtils.mkdir_p import_directory
    kmz_path = File.join(import_directory, 'airports.zip')
    kml_path = File.join(import_directory, 'airports.kml')

    # puts "Downloading #{KML_URL_AIRPORTS}"
    # response = Faraday.get KML_URL_AIRPORTS
    # File.open(kmz_path, 'wb' ) { |f| f.write(response.body) }
    #
    # puts "Extracting KML from KMZ"
    # Zip::File.open(kmz_path) do |zip_file|
    #   entry = zip_file.get_entry('doc.kml')
    #   File.open(kml_path, 'wb' ) { |f| f.write(entry.get_input_stream.read) }
    # end

    puts "Processing airport list"
    xml = Nokogiri::XML(File.open(kml_path))
    xml.xpath('//xmlns:Placemark').each do |placemark|
      name = placemark.xpath('./xmlns:name').text.strip
      lng, lat = placemark.xpath('./xmlns:Point/xmlns:coordinates').text.strip.split(',')
      description = placemark.xpath('./xmlns:description').text.strip
      # puts description
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

end
