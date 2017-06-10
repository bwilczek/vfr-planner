class AirspacesController < ApplicationController
  skip_before_action :require_authorization, only: [:show, :index]

  def index
    render json: Airspace.where(country: params[:countries])
  end

  def show
    render json: Airspace.find(params[:id])
  end

end
