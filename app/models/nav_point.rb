class NavPoint < ApplicationRecord
  enum kind: [:controlled, :uncontrolled, :military, :airstrip, :helipad, :vfr_point, :ifr_point, :vor, :ndb, :vor_dme, :dme]
  enum status: [:active, :inactive]

  def self.find_for_lat_lng(lat, lng)
    # TODO: fetch NavPoint if exists for given location, otherwise new instance [?]
    NavPoint.new(lat: lat, lng: lng)
  end

  def self.get_country_code(location)
    data = fetch_geocode(location)
    return data['results'].first['address_components'].select{|item| item['types'].include?('country') }.first['short_name'].downcase
  end

  def self.get_name(location)
    data = fetch_geocode(location)
    return data['results'].first['address_components'].select {|item| item['types'].include?('political') }.first['short_name']
  end

  def self.fetch_geocode(location)
    response = Faraday.get "https://maps.googleapis.com/maps/api/geocode/json?latlng=#{location.lat},#{location.lng}"
    JSON.parse(response.body)
  end

end
