class AirspacesController < ApplicationController
  skip_before_action :require_authorization, only: [:show, :index]

  def index
    # params[:mode] tomorrow, today, all
    return all_for_countries(params[:countries]) if params[:mode] == 'all'
    return active_for_countries_and_day(params[:countries], :today) if params[:mode] == 'today'
    return active_for_countries_and_day(params[:countries], :tomorrow) if params[:mode] == 'tomorrow'
  end

  def show
    render json: Airspace.find(params[:id])
  end

  private

  def all_for_countries(countries)
    render json: Airspace.where(country: countries)
  end

  def active_for_countries_and_day(countries, day)
    ret = []
    ActiveAirspace.where(country: countries, day: day).each do |aa|
      ret << {
        id: aa.airspace.id,
        name: aa.airspace.name,
        kind: aa.airspace.kind,
        description: aa.extra_description,
        level_min: aa.level_min,
        level_max: aa.level_max,
        time_from: aa.time_from,
        time_to: aa.time_to,
        country: aa.airspace.country,
        points: aa.airspace.points
      }
    end
    render json: ret
  end

end
