class ActiveAirspace < ApplicationRecord
  belongs_to :airspace
  enum day: [:today, :tomorrow]
end
