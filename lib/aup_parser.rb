require 'nokogiri'

class AupParser
  attr_reader :active_airspaces

  def initialize(path)
    @path = path
    @active_airspaces = []
    @aup_data = []
  end

  def parse
    # parse sections CHARLIE and FOXTROT
    process_file
    # foreach designator find an Airspace
    # build and ActiveAirspace entry and add to @active_airspace
  end

  private

  def process_file
    doc = File.open(@path) { |f| Nokogiri::HTML(f) }
    doc.remove_namespaces!
    rows = doc.xpath('//td[contains(text(), "FOXTROT") or contains(text(), "CHARLIE")]/../../tr[@class]')
    rows.each do |tr|
      designator = tr.xpath('./td')[1].content.chomp
      level_min = tr.xpath('./td')[2].content.chomp
      puts "#{designator} #{Airspace.where(name: designator).count}"
    end
  end
end
