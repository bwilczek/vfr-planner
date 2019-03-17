require_relative './lat_lng'

class ImportNavAids2019
  KIND_MAP = {
    'DVOR/DME' => :vor_dme,
    'DME' => :dme,
    'NDB' => :ndb
  }.freeze

  def initialize(path = nil)
    @path = path || "#{__dir__}/../import/nav_aids_2019.txt"
  end

  def run
    lines = File.read(@path)

    NavPoint.nav_aids.delete_all

    lines.split("\n").each do |line|
      nav_aid = parse_line(line.chomp)
      nav_aid.save!
    end
  end

  private

  def parse_line(line)
    raw = line.split(':')
    raise "Line should contain 8 columns: #{line}" if raw.count != 8

    name = raw[0]      # BYDGOSZCZ
    type = raw[1]      # DVOR/DME
    code = raw[2]      # BYZ
    frequency = raw[3] # 112.700
    channel = raw[4]   # CH74X
    lat_s = raw[5]     # 53°05'54''N
    lng_s = raw[6]     # 017°58'18''E
    elevation = raw[7] # 90 m AMSL

    nav_point = NavPoint.new
    nav_point.name = name
    nav_point.icao_code = code
    nav_point.kind = KIND_MAP[type]
    nav_point.lat = LatLng.parse_string(lat_s)
    nav_point.lng = LatLng.parse_string(lng_s)
    nav_point.elevation = elevation
    nav_point.radio = "#{frequency} #{channel}"
    nav_point.country = 'pl'
    nav_point.status = :active
    nav_point.declination = MagDeclination.get_declination(nav_point)
    nav_point
  end
end
