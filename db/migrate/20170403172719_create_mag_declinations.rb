class CreateMagDeclinations < ActiveRecord::Migration[5.0]
  def change
    create_table :mag_declinations do |t|
      t.integer :lat
      t.integer :lng
      t.float :declination
    end
    add_index :mag_declinations, [:lat, :lng], :unique => true, :name => 'by_location'
  end
end
