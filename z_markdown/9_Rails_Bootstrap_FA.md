--------------------------------------------------------------------------------

# 9. RAILS: USER INTERFACE
  
.--------------------------------------------------------------------------------
### 9.1 Font Awesome setup

> Add this to Gemfile:

		# add font awesome library for icons
		gem 'font-awesome-sass'
		
> Run this terminal command which will fetch the gem online and install it:

		$ bundle install
		
> Add this to app/assets/stylesheets/application.css.scss:

		@import "font-awesome-sprockets";
		@import "font-awesome";
	






--------------------------------------------------------------------------------
### 9.12 Bootstrap Install

> Go to our Gemfile and add this anywhere logical and save the file:  

		# adding bootstrap's gem
		gem 'bootstrap-sass'
	
> Run this terminal command which will fetch the gem online and install it:

		$ bundle install 
	
> Look at the docs for bootstrap-sass on github. Find and rename this file using  
git's command rather than the normal one which results in a delete operation:

		$ cd app/assets/stylesheets 
		$ git mv application.css application.css.scss
	
> Renaming this file lets the preprocessor know we will add SASS syntax to CSS  
Now we will add these two lines to the bottom and hit save:

		@import "bootstrap-sprockets";
		@import "bootstrap";

> If you read the bootstrap docs you will see that you need a javascript plugin.  
Go to the docs on github.com/twbs/bootstrap-sass and you will see  
Require Bootstrap JS in app/assets/javascripts/application.js 

> Find that file and add below the line for jQuery:

		//= require bootstrap-sprockets

> Without this, the site will adapt to some degree but not completely. For example,  
if you have a navigation bar with a number of option they will compress into a menu  
but the menu will not be functional without this inclusion.  


.-------------------------------------------------------------------------------
### 9.13 Bootstrap It Up   

> Add the following to body in app/views/layouts/application.html.erb

		<body>
		<nav class="navbar navbar-inverse navbar-static-top" role="navigation">
		  <div class='container'>
		    <div class="navbar-header">
		      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#main-nav-collapse">
		        <span class="sr-only">Toggle navigation</span>
		        <span class="icon-bar"></span>
		        <span class="icon-bar"></span>
		        <span class="icon-bar"></span>
		      </button>
		      <%= link_to root_path, class: 'navbar-brand' do %>
		        <i class="fa fa-users"></i>
		        Dev Match
		      <% end %>
		    </div>
		    <div class="collapse navbar-collapse" id="main-nav-collapse">
		      <ul class="nav navbar-nav navbar-right">
		        <li><%= link_to "About", about_path %></li>
		        <li><%= link_to "Contact Us", '#' %></li>
		      </ul>
		    </div><!-- /.navbar-collapse -->
		  </div>
		</nav>
		  
		<div class="container">
		  <% flash.each do |key, value| %>
		    <%= content_tag :div, value, class: "alert alert-#{key}" %>
		  <% end %>
		  
		  <%= yield %>
		</div>
		  
		</body>

> Now go to home.html.erb and wrap it in jumbotron, center it and add/change stuff:  

      <div class="jumbotron text-center">
        <h1>Welcome</h1>
        <h3>Sample Software-as-a-Service</h3>
      </div>
      
> More will be added to both of these files later on.


> Now lets make these forms look a little bit better. The page we went to at 
/users/sign_up devise/registrations#new according to rake routes which is 
app/views/devise/registrations/new.html.erb. Change it to:  

		<div class="row">
		  <div class="col-md-4 col-md-offset-4">
			<div class="well">
			<h2>Sign up</h2>
			  <%= form_for(resource, as: resource_name, url: registration_path(resource_name)) do |f| %>
				<%= devise_error_messages! %>
				<div class="field form-group">
				  <%= f.label :email %><br />
				  <%= f.email_field :email, autofocus: true, class: 'form-control' %>
				</div>
				<div class="field form-group">
				  <%= f.label :password %>
				  <% if @validatable %>
				  <em>(<%= @minimum_password_length %> characters minimum)</em>
				  <% end %><br />
				  <%= f.password_field :password, autocomplete: "off", class: 'form-control' %>
				</div>
				<div class="field form-group">
				  <%= f.label :password_confirmation %><br />
				  <%= f.password_field :password_confirmation, autocomplete: "off", class: 'form-control' %>
				</div>
				<div class="actions form-group">
				  <%= f.submit "Sign up", class: 'btn btn-success' %>
				</div>
			  <% end %>
			  <%= render "devise/shared/links" %>
			</div>
		  </div>
		</div>

> Now go to /users/sign_in and you will see a similar form only pointing to 
devise/sessions#new which is app/views/devise/sessions/new.html.erb
Lets change it to: 

		<div class="row">
		  <div class="col-md-4 col-md-offset-4">
			<div class="well">
			  <h2>Log in</h2>
			  <%= form_for(resource, as: resource_name, url: session_path(resource_name)) do |f| %>
				<div class="field form-group">
				  <%= f.label :email %><br />
				  <%= f.email_field :email, autofocus: true, class: 'form-control' %>
				</div>
				<div class="field form-group">
				  <%= f.label :password %><br />
				  <%= f.password_field :password, autocomplete: "off", class: 'form-control' %>
				</div>
				<% if devise_mapping.rememberable? -%>
				  <div class="field form-group">
					<%= f.check_box :remember_me %>
					<%= f.label :remember_me %>
				  </div>
				<% end -%>
				<div class="actions form-group">
					<%= f.submit "Log in", class: 'btn btn-primary' %>
				</div>
			  <% end %>
			  <%= render "devise/shared/links" %>
			</div>
		  </div>
		</div>
   
> Now we want to add the user signin/signup to the navbar.  
Open up app/views/layouts/application.html.erb  
Here is the contents of .navbar-collapse:

    <div class="collapse navbar-collapse" id="main-nav-collapse">
      <div class="nav navbar-nav navbar-right">
        <% if user_signed_in? %>
          <%= button_to "Sign Out", destroy_user_session_path, method: :delete, class: 'btn btn-primary navbar-btn' %>
        <% else %>
          <%= link_to "Log In", new_user_session_path, class: 'btn btn-primary navbar-btn', method: :get %>
        <% end %>
      </div>
      <ul class="nav navbar-nav navbar-right">
        <% if user_signed_in? %>
          <li><%= link_to "Community", '#' %></li>
          <li><%= link_to "My Account", '#' %></li>
        <% end %>
        <li><%= link_to "About", about_path %></li>
        <li><%= link_to "Contact Us", new_contact_path %></li>
      </ul>
    </div><!-- /.navbar-collapse -->
    
