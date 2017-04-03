class MagDeclination < ApplicationRecord

  def self.get_declination(location)
    # duck-typed `location`: anything that responds_to :lat and :lng
    # select * from mag_declinations
    # where lat in (floor(1.5), ceil(1.5))
    # and lng in (floor(2.5), ceil(2.5))
  end

  def self.update_all
    # iterate whole globe (http://www.magnetic-declination.com/)
    # insert declination for each lat and lng degree
  end

end
