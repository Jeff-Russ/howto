class HomeController < ApplicationController
  def index
    # render :layout => 'home_layout'
    redirect_to 'http://www.jeffruss.com/'
  end

  def admin
    render :layout => 'home_layout'
  end
end
