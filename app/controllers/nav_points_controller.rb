class NavPointsController < ApplicationController

  def index
    render json: NavPoint.all
  end

end
