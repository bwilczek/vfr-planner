require 'see_you_cup'

class ImportLotnikNavPoints
  KIND_MAP = {
    'Waypoint' => :vfr_point,
    'Airfield with grass surface runway' => :uncontrolled,
    'Outlanding' => :airstrip,
    'Airfield with solid surface runway' => :controlled
  }.freeze

[:controlled, :uncontrolled, :military, :airstrip, :other_airstrip]

  STATUS_MAP = {
    'Drogowy Odcinek Lotniskowy' => :other_airstrip,
    'Ladowisko' => :airstrip,
    'Ladowisko niepotwierdzone' => :other_airstrip,
    'Ladowisko trudne' => :other_airstrip,
    'Ladowisko zarejestrowane' => :uncontrolled,
    'Lotnisko' => :uncontrolled,
    'Lotnisko kontrolowane' => :controlled,
    'Lotnisko wojskowe' => :military,
    'Lądowisko' => :airstrip
  }.freeze

  def initialize(path = nil)
    @path = path || "#{__dir__}/../import/Nasze_Trawniki_PunktyVFR_PL.cup"
    @statuses = []
  end

  def run
    waypoints = SeeYouCup::Parser.new(@path).parse

    NavPoint.aerodromes_with_points.delete_all

    waypoints.each do |wp|
      nav_point = NavPoint.new
      nav_point.name = wp.name
      nav_point.icao_code = wp.code
      nav_point.lat = wp.lat
      nav_point.lng = wp.lon
      nav_point.elevation = wp.elev
      nav_point.radio = wp.freq
      nav_point.description = wp.desc
      nav_point.country = 'pl'
      nav_point.status = :active
      nav_point.declination = MagDeclination.get_declination(nav_point)
      nav_point.kind = get_kind(wp)
      nav_point.save
    end
    puts @statuses.sort.uniq
  end

  def get_kind(wp)
    status = wp.desc.match(/Status: ([^;]+);/)
    status = status[1].strip if status && status[1]
    STATUS_MAP[status] || KIND_MAP[wp.style]
  end
end
