class Plan < ApplicationRecord
  belongs_to :user
  enum status: [:priv, :pub]

  def self.from_js_state(state, current_user)
    plan = Plan.find_by(id: state['id']) || Plan.new
    plan.name = state['name']
    plan.user = current_user
    plan.description = state['description']
    plan.status = state['public'] ? :pub : :priv
    plan.airspeed = state['tas']
    plan.waypoints = state['waypoints'].to_json
    plan.level_min = state['levels'][0]
    plan.level_max = state['levels'][1]
    plan.time_from = state['hours'][0]
    plan.time_to = state['hours'][1]
    plan
  end

  def to_js_state
    # MODEL:
    # t.string :name
    # t.text :waypoints
    # t.text :description
    # t.integer :status
    # t.references :user, foreign_key: true
    # t.integer :airspeed
    # t.integer :level_min
    # t.integer :level_max
    # t.integer :time_from
    # t.integer :time_to
    # STATE:
    # id: 666
    # name: ""
    # description: ""
    # hours: Array(2)
    # levels: Array(2)
    # public: false
    # tas: 70
    # waypoints: Array(4)
    # windDirection: 0
    # windSpeed: 0
    {
      id: id,
      name: name,
      description: description,
      waypoints: JSON.parse(waypoints),
      public: pub?,
      hours: [time_from, time_to],
      levels: [level_min, level_max],
      tas: airspeed
    }
  end
end
