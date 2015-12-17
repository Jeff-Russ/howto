
--------------------------------------------------------------------------------

# RAILS 6: USER CONTENT PART 2

--------------------------------------------------------------------------------
### 6.1 BEFORE ACTION TO SECURE PAGES
**Overview** Right now our site allows for some activities that we would like to 
restrict for security reasons. Here is what we would like to prevent:

1. **Non-members can view profiles**
	The show action for each profile is a url that anyone can access.

2. **Non-members can edit or re-create any user's profile**
	The pages handled by profiles_controller.rb are not restricted to users.

3. **Users can edit or re-create other user's profiles**
	The pages handled by profiles_controller.rb are not restricted their owner.

We will use Rail's 'before actions" to fix these here are the solutions:

1. **Non-members CAN'T view profiles**
	In users_controller.rb, add the following to the top of the class.  
	authenticate_user is defined by the devise gem.  
	
		  before_action :authenticate_user!

2. **Non-members CAN'T edit or re-create any user's profile**
	In profiles_controller.rb, add the same line to the top of the class.

3. **Users CAN'T edit or re-create other user's profiles**
  In profiles_controller.rb, add this below :authenticate_user.

		  before_action :only_current_user

	only_current_user is not defined at all. We need to define it in this class:  
	
		  def only_current_user
			 @user = User.find( params[:user_id] )
			 redirect_to(pages_home_path) unless @user == current_user
		  end



--------------------------------------------------------------------------------
### 6.4 USER PROFILE STYLES 
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
### 6.5 COMMUNITY INDEX PAGE
**Overview** Commit with message "Added index action and updated link"
	
1. **Add index Action to Users Controller**  
	
	Define index in app/controllers/users_controller.rb:
		  ...
		  def index
			 @users = User.all   #   or @users = User.includes(:profile)
		  end
		  ...
	
	Create the matching view file app/views/users/index.html.erb
	
2. **Finish the Link to Community on the Home Page**  
	
	In app/views/pages/home.html.erb we have a # placeholder. The line should now be:  
		  ...
		  <%= link_to "Visit the community", users_path, class: 'btn btn-default btn-lg btn-block' %>
		  ...
	We got users_path from rake routes but, btw, we can also use users_url but keep  
	In mind that it exposed the url if someone inspects the button.  
	
3. **Expermental Views of @users Object**
	
	Now that we have the @users object available, go to /users/index.html.erb and  
	Try accessing it in various ways, surrounded by `<%= %>`. If you try @users  
	in there you will get the address of an ActiveRecord_Relation object. Now try 
	@users.count and it will show you how many users there are. Now try this:
	
		<% @users.each do |user|%>
			<%= user.id %><%= user.profile.job_title %><br>
			<%= user.profile.first_name %> <%= user.profile.last_name %><br>
		<% end %>
	
4.**Final State of app/views/users/index.html**

		<div class="row">
			<div class="col-md-8 col-md-offset-2">
				<ul class="list-unstyled">
					<% @users.each do |user|%>
						<% if user.profile %>
							<li>
								<div class="well row 
								<%= cycle('white-bg', '') %>">
									<div class="col-sm-4 text-center">
										<% if user.profile.avatar %><%= link_to user do %>
											<%= image_tag user.profile.avatar.url(:thumb) %>
										<% end %>
								<% end %>
									</div>
									<div>
										<%= link_to user do %>
											<h2><%= user.profile.first_name %> 
											    <%= user.profile.last_name %></h2>
										<% end %>
										<p><%= user.profile.job_title %> 
										<% if user.plan_id == 2 %>
											<span class="label label-success">PRO</span>
										<% else %>
											<span class="label label-default">Basic</span>
										<% end %></p>
									</div>
								</div>
							</li>
						<% end %>
					<% end %>
				</ul>
			</div>
		</div>
	
--------------------------------------------------------------------------------
### 6.6 COMUNITY PAGE STYLES
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
### 6.7 GENERAL IMPROVEMENTS
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
### 6.8 COPY IMPROVEMENTS
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


