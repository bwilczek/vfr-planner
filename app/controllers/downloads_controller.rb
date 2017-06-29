class DownloadsController < ActionController::Base
  def pdf
    @flight_plan = JSON.parse(params['flightPlan'])
    @navigation_data = JSON.parse(params['navigationData'])
    @print_settings = JSON.parse(params['printSettings'])
    Rails.logger.info('=================')
    Rails.logger.info(@navigation_data['waypoints'][0].keys)
    Rails.logger.info('=================')
    render pdf: 'demo', disposition: 'inline', page_size: 'A4'
  end
end
