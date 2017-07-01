class NavPointsController < ApplicationController
  skip_before_action :require_authorization, only: [:show, :index, :find]

  def index
    render json: NavPoint.where(kind: params[:kinds], country: params[:countries], status: :active)
  end

  def show
    render json: NavPoint.find(params[:id])
  end

  def find
    point = NavPoint.find_for_lat_lng(params[:lat].to_f, params[:lng].to_f)
    name = NavPoint.get_name point
    point.declination = MagDeclination.get_declination point unless point.declination
    render json: {
      declination: point.declination,
      radio: point.radio,
      elevation: point.elevation,
      name: name,
      key: params[:key],
      lat: params[:lat],
      lng: params[:lng]
    }
  end
end
