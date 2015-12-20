require 'nokogiri'
require 'open-uri'

class RailsController < ApplicationController
  def initial_setup
    @file = File.read("z_markdown/1_Rails_Inital_Setup.md")
  end

  def generate
  end

  def sendgrid
    dl = Nokogiri::HTML(open('https://raw.githubusercontent.com/Jeff-Russ/howto/master/z_markdown/5_Rails_Users_w_bcrypt.md')) 
    @doc = ReverseMarkdown.convert dl
  end

  def bcrypt
  end

  def devise
  end

  def stripe
  end

  def media
  end

  def markdown
  end
end
