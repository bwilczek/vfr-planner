class ChangeNavPointDescriptionColumnType < ActiveRecord::Migration[5.0]
  def change
    change_table :nav_points do |t|
      t.change :description, :text
    end
  end
end
