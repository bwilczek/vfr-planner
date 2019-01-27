require 'nokogiri'

class AupParser
  attr_reader :active_airspaces

  def initialize(path)
    @path = path
    @active_airspaces = []
    @aup_data = []
  end

  def parse
    process_file
    @active_airspaces
  end

  private

  def process_file
    doc = File.open(@path) { |f| Nokogiri::HTML(f) }
    doc.remove_namespaces!
    rows = doc.xpath('//table[@data-table="charlie"]//tbody//tr')
    rows.each do |tr|
      original_designator = tr.xpath('./td')[1].content.chomp
      designators = [original_designator]
      level_min = parse_level(tr.xpath('./td')[2].content.chomp)
      level_max = parse_level(tr.xpath('./td')[3].content.chomp)
      time_from = parse_time(tr.xpath('./td')[4].content.chomp)
      time_to = parse_time(tr.xpath('./td')[5].content.chomp)
      if time_from == time_to
        time_from = 0
        time_to = 2359
      end
      description = tr.xpath('./td')[6].content.chomp + "\n" + tr.xpath('./td')[8].content.chomp
      multiple_airspaces = designators.first.match(/(?<prefix>(?:.*)[0-9])(?<letters>[A-Z]{1,})/)
      if multiple_airspaces
        designators = multiple_airspaces['letters'].split('').map { |l| "#{multiple_airspaces['prefix']}#{l}" }
      end
      designators.each do |designator|
        airspace = Airspace.find_by_designator(designator)
        next unless airspace
        active_airspace = ActiveAirspace.new
        active_airspace.airspace = airspace
        active_airspace.country = 'pl'
        active_airspace.extra_description = description
        active_airspace.time_from = time_from
        active_airspace.time_to = time_to
        active_airspace.level_min = level_min
        active_airspace.level_max = level_max
        @active_airspaces << active_airspace
      end
    end
  end

  def parse_level(str)
    return 0 if str == 'GND'
    str.gsub(/\D/, '').to_i * 100
  end

  def parse_time(str)
    str.gsub(/\D/, '').to_i
  end
end
