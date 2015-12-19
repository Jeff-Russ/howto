--------------------------------------------------------------------------------

# RAILS - USER INTERFACE
  
.-------------------------------------------------------------------------------
### 1. Bootstrap It Up   

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
    
--------------------------------------------------------------------------------
### FROM 5.6 
    
3. **Add some style in app/views/pages/home.html.erb**
		  
	Now lets add some bootstrap to match the rest of the page

			 <% if user_signed_in? %>
			 
				<div class="col-md-6">
				  <div class="well">
					 <h2 class="text-center">Your Profile</h2>
					 
					 <% if current_user.profile %>
						<%= link_to "Edit your profile", "#", class: 'btn btn-default btn-lg btn-block' %>
						<%= link_to "View your profile", user_path(current_user), class: 'btn btn-default btn-lg btn-block' %>
					
					 <% else %>
						<p>Create your profile so that you can share your information with the community.</p>
						<%= link_to "Create your profile", new_user_profile_path(current_user), class: 'btn btn-default btn-lg btn-block'%>
					 
					 <% end %>
					 
				  </div>
				</div>
			 
				<div class="col-md-6">
				  <div class="well">
					 <h2 class="text-center">The Community</h2>
					 <!-- Next step will insert here !-->
				  </div>
				</div>
			 
	Before we had the left half be the Basic button and the right be the Pro button.  
	Now the plan is to have links to edit and view on the left and a link to the  
	community on the right. 
--------------------------------------------------------------------------------
### 6.4 User Profile Styles
**Overview**

1. **Improving user#show Formatting**
	
	 1. Wrap everything in view/users/show.html.erb in a row and split to two col
		 
				<div class="row">
				  <div class="col-md-3 text-center">
					 <!-- image tag here !-->
				  </div>
				  <div class="col-md-9">
					 <!-- everything else here !-->
				  </div>
				</div>
			
			text-center is just to move the avatar a little to the right.
			
	 2. Wrap each field in a different tag:
		 
		 Wrapping in headers will make the text bigger and will make them be stacked  
		 vertically. Wrap the first and last name in a single h1 tag. Wrap the  
		 job_title in h3. Put description inside of a well div 
		 
2. **Use Font Awesome Icons for different job_title**
		 
	To do this we'll use the helper files. If we make a file called users_helper.rb  
	Rails will be smart enough to know this will be used with the users controller.  
	The class we define here in app/helpers/users_helper.rb will be used in users#show:  
		 
		module UsersHelper
			def job_title_icon
				if @user.profile.job_title == "Developer"
					"<i class='fa fa-code'></i>".html_safe
				elsif @user.profile.job_title == "Entrepreneur"
					"<i class='fa fa-lightbulb-o'></i>".html_safe
				elsif @user.profile.job_title == "Investor"
					"<i class='fa fa-dollar'></i>".html_safe
				end 
			end
		end
	
	Now go back to /users/show.html.erb and add the Ruby code seen here:  
	
		 <h3><span class="ss-job-title-icon"><%= job_title_icon %>
				</span><%= @user.profile.job_title %></h3>
	
	As you can probably tell, we wrapped it in a span with the class job-title-icon  
	Which doens't exist yet. This is because it looks bland without styling.  
	Right now if you look you will not see any styling yet so we have to make it in CSS.  

3. **Make a CSS stylesheet for Users**  
	
	Create the file app/assets/stylesheets/users.css.scss. Because of it's naming   
	it will be automatically included on our html page.  
	
		  .job-title-icon {
			 display: inline-block;
			 width: 30px;
			 height: 30px;
			 border: 2px solid #2e6da4;
			 border-radius: 4px;
			 background-color: #337ab7;
			 color: white;
			 text-align: center;
		  }
		  .well.profile-block {
			 color: #fff;
			 h3 { margin-top: 0; }
		  }
		  .well.ss-profile-description {
			 background-color: #5cb85c;
			 border-color: #4cae4c;
		  }
		  .well.ss-contact-info {
			 background-color: #5bc0de;
			 border-color: #46b8da;
		  }

4. **app/views/users/show.html.erb**  
	
	Here is the final state of app/views/users/show.html.erb:
	
		  <div class="row">
			 <div class="col-md-3 text-center">
				<%= image_tag @user.profile.avatar.url %>
			 </div>
			 <div class="col-md-6">
				<h1><%= @user.profile.first_name %> <%= @user.profile.last_name %></h1>
				<h3><span class="job-title-icon"><%= job_title_icon %></span> 
					<%= @user.profile.job_title %></h3>
				<div class="well profile-block profile-description">
				  <h3>Description</h3>
				  <%= @user.profile.description %>
				</div>
				<% if true#current_user.plan_id == 2 %>
				  <div class="well profile-block contact-info">
					 <h3>Contact Info</h3>
					 <%= @user.profile.phone_number %><br/>
					 <%= @user.profile.contact_email %><br/>
				  </div>
				<% end %>
			 </div>
		  </div>
	 
   
--------------------------------------------------------------------------------
### 6.6 Community Style Pages
**Overview** Commit with message "Made corrections to index and show page"
	
1. **app/views/users/index.html.erb**  
	
		  <div class="row">
			 <div class="col-md-8 col-md-offset-2">
				<ul class="list-unstyled">
				  <% @users.each do |user| %>
					 <% if user.profile %>
					 <li>
						<div class="well row <%= cycle('white-bg', '') %>">
						  <div class="col-sm-4 text-center">
							 <% if user.profile.avatar %>
								<%= link_to user do %>
								  <%= image_tag user.profile.avatar.url(:thumb), class: 'user-index-avatar' %>
								<% end %>
							 <% end %>
						  </div>
						  <div>
							 <%= link_to user do %>
								<h2><%= user.profile.first_name %> <%= user.profile.last_name %></h2>
							 <% end %>
							 <p><%= user.profile.job_title %>
						  </div>
						</div>
					 </li>
					 <% end %>
				  <% end %>
				</ul>
			 </div>
		  </div>
	
2. **app/controllers/users_controller.rb**  
	
		  ...
		  def index
			 @users = User.includes(:profile)
		  end
		  ...
	
3. **app/assets/stylesheets/users.css.scss**  
	
		  /* Users Show Page Styles */
		  .user-show-avatar {
			 height: 128px;
			 width: 128px;
		  }
		  .job-title-icon {
			 display: inline-block;
			 width: 30px;
			 height: 30px;
			 border: 2px solid #2e6da4;
			 border-radius: 4px;
			 background-color: #337ab7;
			 color: white;
			 text-align: center;
		  }
		  .well.profile-block {
			 color: #fff;
			 h3 {
				margin-top: 0;
			 }
		  }
		  .well.profile-description {
			 background-color: #5cb85c;
			 border-color: #4cae4c;
		  }
		  .well.contact-info {
			 background-color: #5bc0de;
			 border-color: #46b8da;
		  }
		  /* Users Index Page Styles */
		  .user-index-avatar {
			 border-radius: 50%;
		  }
		  .well.white-bg {
			 background-color: white;
		  }
	
4. **app/views/users/show.html.erb**  
	
	add the style class seen here:
		  ...
		  <%= image_tag @user.profile.avatar.url, class: 'user-show-avatar' %>
		  ...
	
5. **console commands**  
	
		  git add .
		  git commit -m "Improved users index page"
		  git push origin user_profiles

6. **app/views/users/index.html.erb**  

		  ...
		  <p><%= user.profile.job_title %></p>
		  ...

7. **app/views/users/show.html.erb**  

		  ...
		  <% if current_user.plan_id == 2 %>
		  ...

--------------------------------------------------------------------------------
### 6.7 General Improvements
**Overview** Commit with message "General improvements"

1. **Basic and Pro Badges Next to Each User**  
	
	Replace the contents of the last div in app/views/users/index.html.erb with:
	
		  <%= link_to user do %>
			 <h2><%= user.profile.first_name %> <%= user.profile.last_name %></h2>
		  <% end %>
		  <p>
			 <%= user.profile.job_title %> 
			 <% if user.plan_id == 2 %>
				<span class="label label-success">PRO</span>
			 <% else %>
				<span class="label label-default">Basic</span>
			 <% end %>
		  </p>
	
2.  **Add Link to Community and Settings On Navbar**
	
	For this we will insert code into app/views/layouts/application.html.erb
	The first and last lines below should already be there:  
		
		  <ul class="nav navbar-nav navbar-right">
		  
			 <% if user_signed_in? %>
				<li><%= link_to "Community", users_path %></li>
				<li><%= link_to "My Account", edit_user_registration_path %></li>
			 <% end %>
			 
			 <li><%= link_to "About", about_path %></li>
	
3. **Edit User Settings Page**  
	
	In app/views/devise/registrations/edit.html.erb:
	 
	1. Change all `<div class="field">` and `<div class="actions form-group">` to 
		`<div class="actions form-group">`and `<div class="field form-group">`  
		
	2. Add `, class: 'form-control' ` to the end of each form field. For example:  
		`<%= f.email_field :email, autofocus: true, class: 'form-control' %>` 
		
	3. For the submit button, change  `<%= f.submit "Update"` to  
		`<%= f.submit "Update", class: 'btn btn-primary' %>`
		 
	4. Similarly, for the cancel account button which starts with `<p>Unhappy?` have  
		it end with `, class: 'btn btn-danger' %></p>`
		 
	5. Wrap the entire document in:
		  
		  <div class="row">
			 <div class="col-md-6 col-md-offset-3">
				<!-- Document goes here !-->
			 </div>
		  </div>

--------------------------------------------------------------------------------
### 6.8 Copy Improvements
**Overview** Commit with message "Added helpful copy"

1. *Better About Us Page**  
	 
	The entire contents of app/views/pages/about.html.erb:  
	
		<h2>About This App</h2>
		<p>This is a sample SaaS "Software-as-Service" app made by Jeff Russ</br>
		It's built with Rails, uses Devise for user authentication and Stripe for credit 
		card processing.</p>
	
2. **Add Header to Contact Us Page**  
	 
	The first and last line will already be there app/views/contacts/new.html.erb
	
		  <div class="col-md-4 col-md-offset-4">
			 
			 <h1 class="text-center">Contact Us</h1>
			 <p class="text-center">Reach out if you have any questions or comments.</p>
			 
			 <div class="well">
			 
3. **Add Header to Community Page**  
	 
	The first and last line will already be there app/views/users/index.html.erb
	
		  <div class="col-md-8 col-md-offset-2">
			 
			 <h1>Dev Match Community</h1>
			 <p>Welcome to the Dev Match community. 
			 </br>Users must fill out a profile in order to be visible in the community.</p>
			 
			 <ul class="list-unstyled">


