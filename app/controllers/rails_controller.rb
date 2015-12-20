require 'nokogiri'
require 'open-uri'

class RailsController < ApplicationController
  def initial_setup
    text = File.read("z_markdown/1_Rails_Inital_Setup.md")
    html_toc = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC)
    markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML.new(:with_toc_data => true))
    @toc  = html_toc.render(text).html_safe
    @html = markdown.render(text).html_safe
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
