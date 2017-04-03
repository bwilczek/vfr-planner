# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170403172719) do

  create_table "dupa", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer "lat",                    null: false
    t.integer "lng",                    null: false
    t.float   "declination", limit: 24, null: false
    t.index ["lat", "lng"], name: "location", using: :btree
  end

  create_table "mag_declinations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci" do |t|
    t.integer "lat"
    t.integer "lng"
    t.float   "declination", limit: 24
    t.index ["lat", "lng"], name: "by_location", unique: true, using: :btree
  end

  create_table "nav_points", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.float    "lat",         limit: 24
    t.float    "lng",         limit: 24
    t.integer  "kind"
    t.integer  "status"
    t.string   "height"
    t.string   "elevation"
    t.string   "icao_code"
    t.string   "description"
    t.string   "radio"
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
    t.string   "country",     limit: 6
    t.index ["country"], name: "index_nav_points_on_country", using: :btree
  end

  create_table "sessions", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "token"
    t.integer  "user_id"
    t.datetime "last_used"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["token"], name: "index_sessions_on_token", unique: true, using: :btree
    t.index ["user_id"], name: "index_sessions_on_user_id", using: :btree
  end

  create_table "users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.string   "provider_id"
    t.datetime "last_login"
    t.integer  "status"
    t.boolean  "admin"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.index ["provider_id"], name: "index_users_on_provider_id", unique: true, using: :btree
  end

  add_foreign_key "sessions", "users"
end
