class LatLng
  EARTH_RADIUS = 3_440 # nm = 6_371km

  attr_accessor :lat, :lng

  class << self
    def parse_string(input)
      # 016°28'22''E
      parsed = input.match(/(\d+)\D+(\d+)\D+(\d+)\D+(N|S|E|W)/)
      deg = parsed[1].to_i
      min = parsed[2].to_i
      sec = parsed[3].to_i
      hem = parsed[4].strip.upcase
      sign = %w(W S).include?(hem) ? -1 : 1
      sign * (deg + (min * 1.to_f / 60.to_f) + (sec * 1.to_f / 3600.to_f))
    end

    def build_from_string(text)
      lat_s, lng_s = text.split('N ')
      build_from_strings(lat_s+'N', lng_s)
    end

    def build_from_strings(lat_s, lng_s)
      # 51°55'12''N 016°28'22''E
      LatLng.new.tap do |p|
        p.lat = parse_string(lat_s)
        p.lng = parse_string(lng_s)
      end
    end
  end

  def deg2rad(deg)
    deg * 0.0174532925
  end

  def rad2deg(rad)
    rad * 57.2957795
  end

  def lat_rad
    deg2rad lat
  end

  def lng_rad
    deg2rad lng
  end

  # heading: degrees, distance: NM
  # reference: https://github.com/alexreisner/geocoder/blob/master/lib/geocoder/calculations.rb#L269
  def next(heading:, distance: )
    heading_rad = deg2rad(heading)
    distance = Float(distance)

    end_lat = Math.asin(Math.sin(lat_rad)*Math.cos(distance/EARTH_RADIUS) +
              Math.cos(lat_rad)*Math.sin(distance/EARTH_RADIUS)*Math.cos(heading_rad))

    end_lng = lng_rad+Math.atan2(Math.sin(heading_rad)*Math.sin(distance/EARTH_RADIUS)*Math.cos(lat_rad),
                      Math.cos(distance/EARTH_RADIUS)-Math.sin(lat_rad)*Math.sin(end_lat))

    LatLng.new.tap do |p|
      p.lat = rad2deg(end_lat)
      p.lng = rad2deg(end_lng)
    end
  end
end
