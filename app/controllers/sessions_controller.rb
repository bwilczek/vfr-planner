class SessionsController < ApplicationController
  skip_before_action :require_authorization, only: [:create]

  def create
    if params[:provider] == 'facebook'
      graph = Koala::Facebook::API.new(params[:token])
      profile = graph.get_object('me')
      name = profile['name']
      provider_id = "facebook:#{profile['id']}"
      img_url = "https://graph.facebook.com/#{profile['id']}/picture?type=small"
    elsif params[:provider] == 'google'
      # url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=#{params[:token]}"
      url = "https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=#{params[:token]}"
      profile = JSON.parse(Net::HTTP.get(URI.parse(url)))
      name = profile['name']
      provider_id = "google:#{profile['email']}"
      img_url = profile['picture']
    end

    # TODO: check status
    @user = User.find_by_provider_id(provider_id)
    if @user
      @user.update(last_login: Time.zone.now, name: name)
    else
      @user = User.create(provider_id: provider_id, name: name, status: 0, admin: false, last_login: Time.zone.now)
    end

    # delete session for this @user.id
    Session.where(user_id: @user.id).destroy_all

    # and generate another session entry
    @session = Session.create(user_id: @user.id, token: SecureRandom.base58(24), last_used: Time.zone.now)

    render json: { id: provider_id, name: @user.name, token: @session.token, img: img_url }
  end
end
