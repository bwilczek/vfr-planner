class CreateSessions < ActiveRecord::Migration[5.0]
  def change
    create_table(:sessions, :options => 'DEFAULT CHARSET=utf8') do |t|
      t.string :token
      t.references :user, unique: true, foreign_key: true
      t.datetime :last_used

      t.timestamps
    end
  end
end
