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

ActiveRecord::Schema.define(version: 20220109204134) do

  create_table "active_airspaces", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer  "airspace_id"
    t.integer  "day"
    t.text     "extra_description", limit: 65535
    t.integer  "level_min"
    t.integer  "level_max"
    t.integer  "time_from"
    t.integer  "time_to"
    t.datetime "created_at",                      null: false
    t.datetime "updated_at",                      null: false
    t.string   "country",           limit: 6
    t.index ["airspace_id"], name: "index_active_airspaces_on_airspace_id", using: :btree
    t.index ["country"], name: "index_active_airspaces_on_country", using: :btree
  end

  create_table "airspaces", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string   "name"
    t.integer  "kind"
    t.string   "country",     limit: 6
    t.text     "points",      limit: 65535
    t.text     "description", limit: 65535
    t.integer  "level_min"
    t.integer  "level_max"
    t.boolean  "permanent"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.string   "designator",  limit: 32
    t.index ["country"], name: "index_airspaces_on_country", using: :btree
  end

  create_table "mag_declinations", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.integer "lat"
    t.integer "lng"
    t.float   "declination", limit: 24
    t.index ["lat", "lng"], name: "by_location", unique: true, using: :btree
  end

  create_table "members", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=latin1" do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.index ["email"], name: "index_members_on_email", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_members_on_reset_password_token", unique: true, using: :btree
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
    t.text     "description", limit: 65535
    t.string   "radio"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.string   "country",     limit: 6
    t.float    "declination", limit: 24
    t.index ["country"], name: "index_nav_points_on_country", using: :btree
  end

  create_table "plans", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string  "name"
    t.text    "waypoints",   limit: 65535
    t.text    "description", limit: 65535
    t.integer "status"
    t.integer "user_id"
    t.integer "airspeed"
    t.integer "level_min"
    t.integer "level_max"
    t.integer "time_from"
    t.integer "time_to"
    t.index ["user_id"], name: "index_plans_on_user_id", using: :btree
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
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.index ["email"], name: "index_users_on_email", unique: true, using: :btree
    t.index ["provider_id"], name: "index_users_on_provider_id", unique: true, using: :btree
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  end

  add_foreign_key "active_airspaces", "airspaces"
  add_foreign_key "plans", "users"
  add_foreign_key "sessions", "users"
end
