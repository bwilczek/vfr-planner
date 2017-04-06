class NavPointsController < ApplicationController
  skip_before_action :require_authorization, only: [:show, :index, :find]

  def index
    render json: NavPoint.where(kind: params[:kinds], country: params[:countries], status: :active)
  end

  def show
    render json: NavPoint.find(params[:id])
  end

  def find
    point = NavPoint.new(lat: params[:lat], lng: params[:lng])
    name = NavPoint.get_name point
    declination = MagDeclination.get_declination point
    render json: { declination: declination, name: name, key: params[:key], lat: params[:lat], lng: params[:lng] }
  end
end
