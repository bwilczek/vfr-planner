class AddIndexToUsersProviderId < ActiveRecord::Migration[5.0]
  def change
    add_index :users, :provider_id, unique: true
  end
end
