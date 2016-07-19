class NavPointsController < ApplicationController

  skip_before_action :require_authorization, only: [ :show, :index ]

  def index
    render json: NavPoint.all
  end

  def show
    render json: NavPoint.find(params[:id])
  end

  def find
    # https://maps.googleapis.com/maps/api/geocode/json?latlng=51.20763622191245,16.99808120727539
  end

end
