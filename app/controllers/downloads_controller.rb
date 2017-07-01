class DownloadsController < ActionController::Base
  def pdf
    @wind_speed = params['windSpeed']
    @wind_direction = params['windDirection']
    @intl = JSON.parse(params['intl'])
    @tas = params['tas']
    @navigation_data = JSON.parse(params['navigationData'])
    @print_settings = JSON.parse(params['printSettings'])
    render pdf: 'demo', disposition: 'inline', page_size: 'A4', show_as_html: false
  end
end
