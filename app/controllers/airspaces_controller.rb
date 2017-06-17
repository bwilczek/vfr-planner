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
    # TODO: re-evaluate this SQL, or even whole datamodel and refactor because it's ugly

    day4sql = case day
    when :today
      0
    when :tomorrow
      1
    else
      666
    end

    countries4sql = countries.map{|c| c.gsub(/[^a-z]/, '') }.to_s.tr('[]', '()')

    sql = "select
      a.id,
      a.name,
      a.kind,
      aa.extra_description as description,
      aa.level_min,
      aa.level_max,
      aa.time_from,
      aa.time_to,
      a.country,
      a.points
      from airspaces a, active_airspaces aa
      where aa.airspace_id = a.id
      and aa.day = #{day4sql}
      and aa.country in #{countries4sql}"

    # TODO: this has to go - to hacky for any standard
    kinds = [:fis, :atz, :ctr, :mctr, :matz, :prohibited, :restricted, :danger, :tra, :tsa, :ea, :tma, :mrt, :tfr, :rmz, :adiz, :other, :notam_point]
    res = ActiveRecord::Base.connection.select_all(sql)
    res.each do |row|
      i = row['kind']
      i = 16 if i.nil? # other
      row['kind'] = kinds[i]
    end
    render json: res
  end

end
