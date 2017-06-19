class IntlController < ApplicationController
  skip_before_action :require_authorization, only: [:list]

  def list
    messages = JSON.parse(File.read(Rails.root.join('client', 'src', 'intl', "#{params[:locale]}.json")))
    render json: { locale: params[:locale], messages: messages }
  end
end
