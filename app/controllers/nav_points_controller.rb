class NavPointsController < ApplicationController

  skip_before_action :require_authorization, only: [ :show, :index ]

  def index
    render json: NavPoint.all
  end

  def show
    render json: NavPoint.find(params[:id])
  end

end
