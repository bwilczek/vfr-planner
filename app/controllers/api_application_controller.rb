class ApiApplicationController < ActionController::API
  before_action :check_session
  before_action :require_authorization
  skip_before_action :require_authorization, only: [:index_html, :index_js]

  def require_authorization
    render(head: true, status: :unauthorized) unless authorized_user
  end

  def check_session
    return unless auth_token
    current_session = Session.find_by_token(auth_token)
    return unless current_session
    current_session.update!(last_used: Time.zone.now)
    @user = current_session.user
  end

  def auth_token
    request.headers['Authorization']
  end

  def authorized_user
    @user
  end

  def index_html
    render text: File.read(Rails.root.join('public', 'index.html')), content_type: 'text/html'
  end

  def index_js
    render js: File.read(Rails.root.join('public', 'index.min.js'))
  end
end
