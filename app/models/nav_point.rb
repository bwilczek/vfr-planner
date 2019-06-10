class NavPoint < ApplicationRecord
  enum kind: [:controlled, :uncontrolled, :military, :airstrip, :helipad, :vfr_point, :ifr_point, :vor, :ndb, :vor_dme, :dme, :other_airstrip]
  enum status: [:active, :inactive]

  scope :nav_aids, -> { where(kind: [:vor, :ndb, :vor_dme, :dme]) }

  ICAO_CODE_MAPPING = {
    'EP' => 'pl',
    'LK' => 'cz',
    'ED' => 'de',
    'LO' => 'au',
    'EY' => 'lt',
    'LZ' => 'sk'
  }.freeze

  def self.find_for_lat_lng(lat, lng)
    # rubocop:disable Rails/FindBy
    NavPoint.where(lat: (lat - 0.001)..(lat + 0.001), lng: (lng - 0.001)..(lng + 0.001)).first || NavPoint.new(lat: lat, lng: lng)
    # rubocop:enable Rails/FindBy
  end

  def self.get_country_code(location)
    data = fetch_geocode(location)
    data.country_code
  end

  def self.get_country_code_for_icao_code(icao_code)
    ICAO_CODE_MAPPING[icao_code[0...2]]
  end

  def self.get_name(point)
    return point.icao_code if point.icao_code
    return point.name if point.name
    data = fetch_geocode(point)
    begin
      return data.city
    rescue
      return 'WPT [?]'
    end
  end

  def self.fetch_geocode(location)
    Geocoder.search([location.lat, location.lng])&.first
  end

  def compute_country_code
    return self if country
    cc = NavPoint.get_country_code_for_icao_code(self)
    if cc
      self.country = cc
      return self
    end
    self.country = NavPoint.get_country_code(self)
  end
end
