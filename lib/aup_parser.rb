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
      original_designator = tr.xpath('./td')[1].content.chomp
      designators = [original_designator]
      level_min = tr.xpath('./td')[2].content.chomp
      multiple_airspaces = designators.first.match(/(?<prefix>(?:.*)[0-9])(?<letters>[A-Z]{1,})/)
      if multiple_airspaces
        designators = multiple_airspaces['letters'].split('').map { |l| "#{multiple_airspaces['prefix']}#{l}" }
      end
      designators.each do |designator|
        cnt = Airspace.where(designator: designator).count
        puts "Unknown/ambiguous designator: #{designator}. Matches: #{cnt}" if cnt != 1
      end
    end
  end
end
