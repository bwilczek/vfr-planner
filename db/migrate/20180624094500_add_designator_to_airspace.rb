class AddDesignatorToAirspace < ActiveRecord::Migration[5.0]
  def change
    add_column :airspaces, :designator, :string, :limit => 32
  end
end
