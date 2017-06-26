class PlansController < ApplicationController
  skip_before_action :require_authorization, only: [:show, :index, :find]

  def show
    plan = Plan.find(params[:id])
    if plan.priv? && plan.user != authorized_user
      render nothing: true, status: :unauthorized
      return
    end
    render json: plan.to_js_state
  rescue ActiveRecord::RecordNotFound
    render nothing: true, status: :not_found
  end

  def create
    plan = Plan.from_js_state(params[:plan], authorized_user)
    plan.save
    render json: plan.to_js_state
  end

  def index
    render json: Plan.where(user: authorized_user).select(:id, :name, :description).order(id: :desc)
  end

  def destroy
    plan = Plan.find(params[:id])
    if plan.user != authorized_user
      render nothing: true, status: :unauthorized
      return
    end
    plan.destroy!
    render nothing: true
  end
end
