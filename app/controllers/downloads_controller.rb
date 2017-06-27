class DownloadsController < ActionController::Base
  def pdf
    @name = 'World'
    render pdf: 'demo', disposition: 'inline', page_size: 'A4'
  end
end
