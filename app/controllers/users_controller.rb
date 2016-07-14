require 'koala'
require 'net/http'

class UsersController < ApplicationController

  def authenticate

    if params[:provider] == 'facebook'
      graph = Koala::Facebook::API.new(params[:token])
      profile = graph.get_object("me")
      name = profile['name']
      provider_id = "facebook:#{profile['id']}"
    elsif params[:provider] == 'google'
      # TODO: validate google token
      url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=#{params[:token]}"
      profile = JSON.parse(Net::HTTP.get(URI.parse(url)))
      name = profile['name']
      provider_id = "google:#{profile['email']}"
    end

    # TODO: use the provider_id to verify user in our database

    render json: {id: provider_id, name: name, token: 'dupsko#blade'}
  end

end
