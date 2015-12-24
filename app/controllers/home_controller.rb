class HomeController < ApplicationController
  def index
    render :layout => 'home_layout'
  end

  def admin
    render :layout => 'home_layout'
  end
end
