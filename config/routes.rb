Rails.application.routes.draw do

  scope '/api' do
    get '/nav_points/find', to: 'nav_points#find'
    post '/intl', to: 'intl#list'

    resources :sessions
    resources :users
    resources :nav_points
  end
  get '/*path/index.min.js', :to => "application#index_js"
  get '*unmatched_route', :to => "application#index_html"
end
