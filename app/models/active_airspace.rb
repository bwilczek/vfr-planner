class ActiveAirspace < ApplicationRecord
  enum day: [:today, :tomorrow]
end
