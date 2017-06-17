class Airspace < ApplicationRecord
  has_many :active_airspace
  enum kind: [:fis, :atz, :ctr, :mctr, :matz, :prohibited, :restricted, :danger, :tra, :tsa, :ea, :tma, :mrt, :tfr, :rmz, :adiz, :other, :notam_point]

end
