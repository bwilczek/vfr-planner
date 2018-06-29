class ActiveAirspace < ApplicationRecord
  belongs_to :airspace
  enum day: [:today, :tomorrow]

  scope :today, -> { where(day: :today) }
  scope :tomorrow, -> { where(day: :tomorrow) }
end
