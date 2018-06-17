require 'faraday'
require 'faraday-cookie_jar'

require_relative 'lotnik_parser'

class ImportLotnik
  CONFIG = {
    all: {
      url: 'http://lotnik.org/strefy/Poland_Airspaces.txt',
      path: "#{Rails.root}/import/Poland_Airspaces.txt"
    },
    today: {
      url: 'http://lotnik.org/strefy/Poland_Airspaces_TODAY.txt',
      path: "#{Rails.root}/import/Poland_Airspaces_TODAY.txt"
    },
    tomorrow: {
      url: 'http://lotnik.org/strefy/Poland_Airspaces_TOMORROW.txt',
      path: "#{Rails.root}/import/Poland_Airspaces_TOMORROW.txt"
    },
    aup_today: {
      url: 'http://www.amc.pansa.pl/generator_AUP.php',
      path: "#{Rails.root}/import/AUP_today.html"
    },
    aup_tomorrow: {
      url: 'http://www.amc.pansa.pl/generator_AUP.php?rodz=jutro',
      path: "#{Rails.root}/import/AUP_tomorrow.html"
    }
  }.freeze

  class << self
    def perform
      # download_airspaces
      download_aup
      # puts File.read CONFIG[:all][:path]
      # #{ImportAtmavio::NAV_POINT_KIND_MAP}"
      # import_all CONFIG[:all][:path]
      [ :today ].each { |day| import_day(day, CONFIG[day][:path]) }
    end

    private

    def download_airspaces
      CONFIG.each do |k, data|
        next if k.to_s.include?('aup')
        File.delete(data[:path]) if File.exists?(data[:path])
        File.open(data[:path], 'w') { |f| f.write(Faraday.get(data[:url]).body) }
      end
    end

    def download_aup
      start_url = 'http://www.amc.pansa.pl/?menu_lewe=aup&lang=_pl&opis=amc_aup'
      conn = Faraday.new(url: start_url) do |c|
        c.use :cookie_jar
        c.adapter Faraday.default_adapter
      end
      conn.get start_url
      CONFIG.each do |k, data|
        next unless k.to_s.include?('aup')
        File.delete(data[:path]) if File.exists?(data[:path])
        File.open(data[:path], 'w', encoding: 'ascii-8bit') { |f| f.write(conn.get(data[:url]).body) }
      end
    end

    def import_all(path)
      # puts "Import all airspaces from #{path}"
      Airspace.delete_all
      airspaces = LotnikParser.new(path).parse
      airspaces.each(&:save)
    end

    def import_day(day, path)
      # TODO: parse 'File created at: 2018-06-16 07:17:02'
      # validate if it REALLY is tomorrow, or today
      # puts "Import #{day} airspaces from #{path}"
    end
  end
end
