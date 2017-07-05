class DownloadsController < ActionController::Base
  def pdf
    @wind_speed = params['windSpeed']
    @wind_direction = params['windDirection']
    @intl = params['intl']
    @tas = params['tas']
    @navigation_data = params['navigationData']
    @print_settings = params['printSettings']
    render pdf: 'demo', disposition: 'inline', page_size: 'A4', show_as_html: false
  end

  def kml
    @waypoints = params['waypoints']
    @coords = @waypoints.map { |e| "#{e['latLng']['lng']},#{e['latLng']['lat']}" }.join "\n"
    render content_type: 'application/vnd.google-earth.kml+xml', filename: 'plan.kml'
  end
end
