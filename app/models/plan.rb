class Plan < ApplicationRecord
  belongs_to :user
  enum status: [:priv, :pub]
end
