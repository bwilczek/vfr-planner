class NavPoint < ApplicationRecord
  enum kind: [:controlled, :uncontrolled, :military, :airstrip, :helipad, :vfr_point, :ifr_point, :vor, :ndb, :vor_dme, :dme, :other_airstrip]
  enum status: [:active, :inactive]

  ICAO_CODE_MAPPING = {
    'EP' => 'pl',
    'LK' => 'cz',
    'ED' => 'de',
    'LO' => 'au',
    'EY' => 'lt',
    'LZ' => 'sk',
  }

  def self.find_for_lat_lng(lat, lng)
    NavPoint.where(lat: (lat-0.001)..(lat+0.001), lng: (lng-0.001)..(lng+0.001)).first || NavPoint.new(lat: lat, lng: lng)
  end

  def self.get_country_code(location)
    data = fetch_geocode(location)
    return nil unless data['status'] == 'OK'
    return data['results'].first['address_components'].select{|item| item['types'].include?('country') }.first['short_name'].downcase
  end

  def self.get_country_code_for_icao_code(icao_code)
    ICAO_CODE_MAPPING[icao_code[0...2]]
  end

  def self.get_name(location)
    data = fetch_geocode(location)
    return data['results'].first['address_components'].select {|item| item['types'].include?('political') }.first['short_name']
  end

  def self.fetch_geocode(location)
    response = Faraday.get "https://maps.googleapis.com/maps/api/geocode/json?latlng=#{location.lat},#{location.lng}"
    JSON.parse(response.body)
  end

  def compute_country_code
    return self if self.country
    if cc = NavPoint.get_country_code_for_icao_code(self)
      self.country = cc
      return self
    end
    self.country = NavPoint.get_country_code(self)
  end

end
