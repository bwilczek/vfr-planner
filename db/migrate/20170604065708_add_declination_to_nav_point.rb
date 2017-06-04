class AddDeclinationToNavPoint < ActiveRecord::Migration[5.0]
  def change
    add_column :nav_points, :declination, :float
  end
end
