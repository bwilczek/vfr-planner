Rails.application.routes.draw do

  scope '/api' do
    get '/nav_points/find', to: 'nav_points#find'
    get '/downloads/pdf', to: 'downloads#pdf'
    post '/intl', to: 'intl#list'

    resources :sessions
    resources :users
    resources :nav_points
    resources :airspaces
    resources :plans
  end
  get '/*path/index.min.js', :to => "application#index_js"
  get '*unmatched_route', :to => "application#index_html"
end
