class AddIndexToSessionsToken < ActiveRecord::Migration[5.0]
  def change
    add_index :sessions, :token, unique: true
  end
end
