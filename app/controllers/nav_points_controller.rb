class NavPointsController < ApplicationController

  skip_before_action :require_authorization, only: [ :show, :index, :find ]

  def index
    render json: NavPoint.all
  end

  def show
    render json: NavPoint.find(params[:id])
  end

  def find
    # https://maps.googleapis.com/maps/api/geocode/json?latlng=51.20763622191245,16.99808120727539
    url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=#{params[:lat]},#{params[:lng]}"
    geo_data = JSON.parse(Net::HTTP.get(URI.parse(url)))
    logger.info(geo_data)
    name = geo_data['results'][0]['address_components'].select{|o| o['types'] == ['locality', 'political']}.first['short_name']
    render json: {name: name, key: params[:key]}
  end

end


# {
#    "results" : [
#       {
#          "address_components" : [
#             {
#                "long_name" : "Unnamed Road",
#                "short_name" : "Unnamed Road",
#                "types" : [ "route" ]
#             },
#             {
#                "long_name" : "Szymanów",
#                "short_name" : "Szymanów",
#                "types" : [ "locality", "political" ]
#             },
