class LotnikParser
  attr_reader :airspaces

  def initialize(path)
    @path = path
    @airspaces = []
    reset
  end

  def parse
    lines = File.readlines(@path)
    lines.each do |line|
      line.chomp!
      case line
      when /^\*/
        next
      when /^AN /
        parse_name(line)
      when /^AC /
        parse_type(line)
      when /^AL /
        parse_level_min(line)
      when /^AH /
        parse_level_max(line)
      when /^DP /
        parse_point(line)
      when /^V X=/
        parse_center(line)
      when /^DC /
        parse_circle(line)
      when ''
        add_airspace
      else
        fail "Unsupported line format: #{line}"
      end
    end
    @airspaces
  end

  private

  def set_airspace_kind(airspace)
    airspace.kind = case airspace.name
                    when /^ATZ/
                      :atz
                    when /^MATZ/
                      :matz
                    when /^CTR/
                      :ctr
                    when /^MCTR/
                      :mctr
                    when /^MRT/
                      :mrt
                    when /^TSA/
                      :tsa
                    when /^TMA/
                      :tma
                    when /^TRA/
                      :tra
                    when /^TFR/
                      :tfr
                    when /^EA/
                      :ea
                    when /^ADIZ/
                      :adiz
                    when /^FIS/
                      :fis
                    when /^RMZ/
                      :rmz
                    when /^EPP /
                      :prohibited
                    when /^EPD /
                      :danger
                    when /^EPR /
                      :restricted
                    when /^IGA /
                      :ignore
                    else
                      :other
                    end
    airspace.permanent = [:ctr, :restricted, :prohibited, :fis, :tma, :adiz].include?(airspace.kind)
  end

  def build_airspace_record(name:, type:, level_min:, level_max:, points:)
    airspace = Airspace.new.tap do |a|
      a.name = name
      a.description = name
      a.level_min = level_min
      a.level_max = level_max
      a.country = 'pl'
      a.points = points.map{ |p| "#{p.lng},#{p.lat}"}.join(' ')
      set_airspace_kind(a)
    end
  end

  def add_airspace
    @airspaces << build_airspace_record(
      name: @name,
      type: @type,
      level_min: @level_min,
      level_max: @level_max,
      points: @points
    )
    reset
  end

  def parse_center(line)
    @center = LatLng.build_from_string(line.gsub(/^V X=/, ''))
  end

  def parse_circle(line)
    radius = Float(line.gsub(/^DC /, '')) # unit: NM
    (0...360).step(10) do |heading|
      @points << @center.next(heading: heading, distance: radius)
    end
  end

  def parse_point(line)
    # DP 53:10:46 N 014:22:40 E
    line = line.gsub(/^DP /, '')
    @points << LatLng.build_from_string(line)
  end

  def parse_name(line)
    @name = line.gsub(/^AN /, '')
  end

  def parse_level(text)
    # 4500F MSL | # GND
    return 0 if text == 'GND'
    text.gsub(/\D/, '').to_i
  end

  def parse_level_min(line)
    @level_min = parse_level(line.gsub(/^AL /, ''))
  end

  def parse_level_max(line)
    @level_max = parse_level(line.gsub(/^AH /, ''))
  end

  def parse_type(line)
    @type = line.gsub(/^AC /, '')
  end

  def reset
    @name = nil
    @type = nil
    @points = []
    @level_min = nil
    @level_max = nil
    @center = nil
  end
end
