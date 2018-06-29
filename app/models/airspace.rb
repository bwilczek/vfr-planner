class Airspace < ApplicationRecord
  has_many :active_airspace, dependent: :delete_all
  enum kind: [:fis, :atz, :ctr, :mctr, :matz, :prohibited, :restricted,
              :danger, :tra, :tsa, :ea, :tma, :mrt, :tfr, :rmz, :adiz, :other, :notam_point, :ignore]

  scope :permanent, -> { where(permanent: true) }
end
