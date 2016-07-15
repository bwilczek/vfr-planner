class CreateNavPoints < ActiveRecord::Migration[5.0]
  def change
    create_table(:nav_points, :options => 'DEFAULT CHARSET=utf8') do |t|
      t.string :name
      t.float :lat
      t.float :lng
      t.integer :type
      t.integer :status
      t.string :height
      t.string :elevation
      t.string :icao_code
      t.string :description
      t.string :radio

      t.timestamps
    end
  end
end
