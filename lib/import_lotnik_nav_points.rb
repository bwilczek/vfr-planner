require 'see_you_cup'

class ImportLotnikNavPoints
  KIND_MAP = {
   'Waypoint' => :vfr_point,
   'Airfield with grass surface runway' => :uncontrolled,
   'Outlanding' => :airstrip,
   'Airfield with solid surface runway' => :controlled
  }.freeze

  def initialize(path = nil)
    @path = path || "#{__dir__}/../import/Nasze_Trawniki_PunktyVFR_PL.cup"
  end

  def run
    waypoints = SeeYouCup::Parser.new(@path).parse

    NavPoint.aerodromes_with_points.delete_all

    waypoints.each do |wp|
      nav_point = NavPoint.new
      nav_point.name = wp.name
      nav_point.icao_code = wp.code
      nav_point.kind = KIND_MAP[wp.style]
      nav_point.lat = wp.lat
      nav_point.lng = wp.lon
      nav_point.elevation = wp.elev
      nav_point.radio = wp.freq
      nav_point.description = wp.desc
      nav_point.country = 'pl'
      nav_point.status = :active
      nav_point.declination = MagDeclination.get_declination(nav_point)
      nav_point.save
    end
  end
end
