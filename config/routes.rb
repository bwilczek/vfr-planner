Rails.application.routes.draw do

  get '/nav_points/find', to: 'nav_points#find'

  resources :sessions
  resources :users
  resources :nav_points

end
