Rails.application.routes.draw do

  post 'authenticate', to: 'users#authenticate'

  resources :nav_points
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
