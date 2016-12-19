class AddCountryToNavPoints < ActiveRecord::Migration[5.0]
  def change
    add_column :nav_points, :country, :string, :limit => 6
    add_index :nav_points, :country
  end
end
