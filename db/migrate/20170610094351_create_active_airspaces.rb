class CreateActiveAirspaces < ActiveRecord::Migration[5.0]
  def change
    create_table(:active_airspaces, :options => 'DEFAULT CHARSET=utf8') do |t|
      t.references :airspace, foreign_key: true
      t.integer :day
      t.text :extra_description
      t.integer :level_min
      t.integer :level_max
      t.integer :time_from
      t.integer :time_to
      t.timestamps
    end
  end
end
