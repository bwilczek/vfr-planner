class AddCountryToActiveAirspaces < ActiveRecord::Migration[5.0]
  def change
    add_column :active_airspaces, :country, :string, :limit => 6
    add_index :active_airspaces, :country
    add_index :airspaces, :country
  end
end
