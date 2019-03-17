require 'faraday'
require 'faraday-cookie_jar'

require_relative 'lotnik_parser'
require_relative 'aup_parser'

OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE

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
      url: 'https://airspace.pansa.pl/uup/current',
      path: "#{Rails.root}/import/AUP_today.html"
    },
    aup_tomorrow: {
      url: 'https://airspace.pansa.pl/aup/next',
      path: "#{Rails.root}/import/AUP_tomorrow.html"
    }
  }.freeze

  AERODROMES_URL = 'http://lotnik.org/pliki/Nasze_Trawniki_PunktyVFR_PL.cup'

  class << self
    def update_all_airspaces
      download_airspaces
      ActiveAirspace.delete_all
      Airspace.delete_all
      import_all CONFIG[:all][:path]
    end

    def update_aup
      download_aup
      ActiveAirspace.delete_all
      import_day(:today, CONFIG[:aup_today][:path])
      import_day(:tomorrow, CONFIG[:aup_tomorrow][:path])
    end

    private

    def download_airspaces
      CONFIG.each do |k, data|
        next if k.to_s.include?('aup')
        File.delete(data[:path]) if File.exists?(data[:path])
        File.open(data[:path], 'w', encoding: 'ascii-8bit') { |f| f.write(Faraday.get(data[:url]).body) }
      end
    end

    def download_aup
      start_url = 'https://airspace.pansa.pl/aup/current'
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
      airspaces = LotnikParser.new(path).parse
      airspaces.each(&:save)
    end

    def import_day(day, path)
      active_airspaces = AupParser.new(path).parse
      return if active_airspaces.empty?
      active_airspaces.each do |aa|
        aa.day = day
        aa.save
      end
      Airspace.permanent.each do |a|
        ActiveAirspace.new.tap do |aa|
          aa.airspace = a
          aa.country = 'pl'
          aa.extra_description = a.description
          aa.time_from = 0
          aa.time_to = 2359
          aa.level_min = a.level_min
          aa.level_max = a.level_max
          aa.day = day
          aa.save
        end
      end
    end
  end
end
