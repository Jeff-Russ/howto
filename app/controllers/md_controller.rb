# call this project pagify-md pagefly docdown docploy livedoc livepage livepage-md

class MdController < ApplicationController
  def index
  end

  def show
    # render :layout => false
    # try this: https://private-jeff-russ.c9users.io/md/show?url=https://s3.amazonaws.com/howto.jeffruss/rails/all.md
    url = "https://s3.amazonaws.com/pubmd/" << params.fetch(:aws) 
    text = open(url) {|f| f.read }
    html_toc = Redcarpet::Markdown.new(Redcarpet::Render::HTML_TOC)
    markdown = Redcarpet::Markdown.new(Redcarpet::Render::HTML.new(:with_toc_data => true))
    @toc  = html_toc.render(text).html_safe
    @html = markdown.render(text).html_safe
  end

  def new
  end

  def edit
  end

  def create
  end

  def update
  end

  def destroy
  end
  
 private
  def contact_params
    params.require(:aws)
  end
end
