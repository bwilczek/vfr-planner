class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table(:users, :options => 'DEFAULT CHARSET=utf8') do |t|
      t.string :name
      t.string :provider_id
      t.datetime :last_login
      t.integer :status
      t.boolean :admin

      t.timestamps
    end
  end
end
