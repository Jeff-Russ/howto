
-------------------------------------------------------------------------------

# RAILS - 

--------------------------------------------------------------------------------
### 1. 

> Add these two gems and `$ bundle install` them:

      gem 'redcarpet' # Github's library for Markdown processing
      gem 'coderay'   # syntax highlighting for many languages

--------------------------------------------------------------------------------
### 2. 

> Redcarpet needs this file: app/helpers/application_helper.rb:

      module ApplicationHelper
      	class CodeRayify < Redcarpet::Render::HTML
      	  def block_code(code, language)
      	    CodeRay.scan(code, language).div
      	  end
      	end
      	
      	def markdown(text)
      	  coderayified = CodeRayify.new(:filter_html => true, 
      	                                :hard_wrap => true)
      	  options = {
      	    :fenced_code_blocks => true,
      	    :no_intra_emphasis => true,
      	    :autolink => true,
      	    :strikethrough => true,
      	    :lax_html_blocks => true,
      	    :superscript => true
      	  }
      	  markdown_to_html = Redcarpet::Markdown.new(coderayified, options)
      	  markdown_to_html.render(text).html_safe
      	end
      end

--------------------------------------------------------------------------------
### 3. 

> Placing md files in at the root of the project make them available in a 
controller like this:

      @file = File.read("file.md")
      
> Or you can put them in a directory called md, for example

      @file = File.read("md/file.md")
      
> The file can have any extension you want or none at all.
> Now in views, this will convert markdown to HTML automatically

      <%= markdown(@file) %> 
      
> With CodeRay you have to use fenced code blocks and identify the language 
you're using instead of indenting to signify a code block.