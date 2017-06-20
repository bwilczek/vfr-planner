class CreatePlans < ActiveRecord::Migration[5.0]
  def change
    create_table(:plans, :options => 'DEFAULT CHARSET=utf8') do |t|
      t.string :name
      t.text :waypoints
      t.text :description
      t.integer :status
      t.references :user, foreign_key: true
      t.integer :airspeed
      t.integer :level_min
      t.integer :level_max
      t.integer :time_from
      t.integer :time_to
    end
  end
end
