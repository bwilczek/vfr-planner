class RenameTypeToKind < ActiveRecord::Migration[5.0]
  def change
    rename_column :nav_points, :type, :kind
  end
end
