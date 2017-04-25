class MagDeclination < ApplicationRecord

  def self.get_declination(location)
    raise "Argument Error" unless location.lat.is_a? Numeric
    raise "Argument Error" unless location.lng.is_a? Numeric
    sql = "select avg(declination) as declination from mag_declinations
      where lat in (floor(#{location.lat}), ceil(#{location.lat}))
      and lng in (floor(#{location.lng}), ceil(#{location.lng}))"
    ActiveRecord::Base.connection.exec_query(sql).to_hash.first['declination']
  end

  def self.populate
    # iterate whole globe (http://www.magnetic-declination.com/)
    # insert declination for each lat and lng degree
    (-179..180).each do |lng|
      (-90..90).each do |lat|
        puts "Fetching for lat=#{lat} lng=#{lng}"
        next if MagDeclination.where(lat: lat, lng: lng).first
        # http://www.magnetic-declination.com/srvact/?lat=50.65990836093937&lng=17.940673828125&sec=o920zjat&act=1
        response = nil
        while response.nil? do
          begin
            response = Faraday.get "http://www.magnetic-declination.com/srvact/?lat=#{lat}&lng=#{lng}&sec=o920zjat&act=1"
          rescue Exception => e
            puts "Error fetching data: #{e.message}, retrying after 10 seconds"
            sleep 10
          end
        end

        raw_deg, raw_min = response.body.split('<br').first.split('&deg;')
        int_part = raw_deg.to_i
        fraction_part = raw_min.strip.gsub(/\D/, '').to_i*100/60
        declination = int_part > 0 ?
          int_part.to_f + fraction_part.to_f/10**(fraction_part.to_s.length) :
          int_part.to_f - fraction_part.to_f/10**(fraction_part.to_s.length)
        puts " > declination=#{declination}"
        md = MagDeclination.where(lat: lat, lng: lng).first_or_initialize
        md.declination = declination
        md.save
        sleep 2
      end
    end
  end

end
