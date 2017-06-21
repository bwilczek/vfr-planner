class PlansController < ApplicationController
  skip_before_action :require_authorization, only: [:show, :index, :find]

  def show
    plan = Plan.find(params[:id])
    if plan.priv? && plan.user != authorized_user
      render nothing: true, status: :unauthorized
      return
    end
    render json: plan
  rescue ActiveRecord::RecordNotFound
    render nothing: true, status: :not_found
  end

  def create
    # Rails.logger.info(params)
    sleep 2
  end
end
