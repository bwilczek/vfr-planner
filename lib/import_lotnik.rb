require 'faraday'
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
    }
  }.freeze

  class << self
    def perform
      download
      # puts File.read CONFIG[:all][:path]
      # #{ImportAtmavio::NAV_POINT_KIND_MAP}"
      import_all CONFIG[:all][:path]
      # [ :today, :tomorrow ].each { |day| import_day(day, CONFIG[day][:path]) }
    end

    private

    def download
      CONFIG.each do |_k, data|
        File.delete(data[:path]) if File.exists?(data[:path])
        File.open(data[:path], 'w') { |f| f.write(Faraday.get(data[:url]).body) }
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
