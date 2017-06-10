class Airspace < ApplicationRecord
  enum kind: [:fis, :atz, :ctr, :mctr, :matz, :p, :r, :d, :tra, :tsa, :ea, :tma, :mrt, :trf, :rmz, :adiz, :other]

end
