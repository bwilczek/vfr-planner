class LatLng
  attr_accessor :lat, :lng

  def self.parse_string(input)
    # 016°28'22''E
    parsed = input.match(/(\d+)\D+(\d+)\D+(\d+)\D+(N|S|E|W)/)
    deg = parsed[1].to_i
    min = parsed[2].to_i
    sec = parsed[3].to_i
    hem = parsed[4].strip.upcase
    sign = %w(W S).include?(hem) ? -1 : 1
    sign * (deg + (min * 1.to_f / 60.to_f) + (sec * 1.to_f / 3600.to_f))
  end

  def self.build_from_strings(lat_s, lng_s)
    # 51°55'12''N 016°28'22''E
    p = LatLng.new
    p.lat = parse_string(lat_s)
    p.lng = parse_string(lng_s)
    p
  end
end
