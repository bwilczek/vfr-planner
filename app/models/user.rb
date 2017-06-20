class User < ApplicationRecord
  has_one :session
  has_many :plan
end
