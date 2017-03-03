class NavPointsController < ApplicationController
  skip_before_action :require_authorization, only: [:show, :index, :find]

  def index
    render json: NavPoint.where(kind: params[:kinds], country: params[:countries], status: :active)
  end

  def show
    render json: NavPoint.find(params[:id])
  end

  def find
    url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=#{params[:lat]},#{params[:lng]}"
    geo_data = JSON.parse(Net::HTTP.get(URI.parse(url)))
    geo_data = geo_data['results'][0]['address_components'].select { |o| o['types'].include?('political') }.map { |o| o['short_name'] }
    render json: { name: geo_data.first, key: params[:key], lat: params[:lat], lng: params[:lng] }
  end
end
