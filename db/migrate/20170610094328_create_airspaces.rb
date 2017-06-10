class CreateAirspaces < ActiveRecord::Migration[5.0]
  def change
    create_table(:airspaces, :options => 'DEFAULT CHARSET=utf8') do |t|
      t.string :name
      t.integer :kind
      t.string :country, :limit => 6
      t.text :points
      t.text :description
      t.integer :level_min
      t.integer :level_max
      t.boolean :permanent
      t.timestamps
    end
  end
end
