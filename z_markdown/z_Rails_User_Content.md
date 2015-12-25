
--------------------------------------------------------------------------------
  
# RAILS 5: USER CONTENT PART 1

--------------------------------------------------------------------------------
### 5.1 PROFILE DATA AND CONTROLLER
**Overview** We want to create a model for user profiles. The user profiles  
will have user_id as an integer, first_name, last_name, job_title, phone_number,  
and contact_email all as strings, a description as text and a timestamp. 

1. **Generate Migration File and Model:**   

		  $ rails generate model Profile user_id:integer first_name:string  last_name:string job_title:string phone_number:string contact_email:string description:text 
	 
2. **Define Associations:**  
	 Entire contents of app/models/profile.rb:

		  class Profile < ActiveRecord::Base
			 belongs_to :user
		  end
		  
	Add to app/models/user.rb:  
		  ...
		  has_one :profile
		  ...
3. **Run Migration:**

		  $ bundle exec rake db:migrate
		 
4. **Create app/controllers/profiles_controller.rb**

	 Eventually we will need the following actions in our profiles_controller:
	 `new create edit update profile_params only_current_user` but we will only  
	 need views for `new` and `edit`. These will be in a new directory views/profiles/  
	 
		  $ bundle exec rails generate controller Profiles new edit

	 This method also generated two unwanted lines in routes.rb. Delete these:
	 
			 get 'profiles/new'
			 get 'profiles/edit'

	 
--------------------------------------------------------------------------------
### 5.2 PARAMETERS EXPLAINED
**Overview** Here we will create a controller for profiles and set the nested  
routes for it. We we will create the action that takes the user to the form to 
provide  profile info. We'll also add a link to this on the home page. 
	
1. **Add to config/routes.rb**

		  resources :users do
			 resource :profile
		  end
	 
	 This generates many nested resources. By nested we mean we get the /users/ url  
	 and nested within it we have many others, such as users/:user_id for every user  
	 and then for each user we get /profile. For all users, we get /users/edit,   
	 users/sign_up, users/edit just to name a few. Run rake rountes to see. 

2. **Add Link to Create Profile On Home Page**

	We need a way for the user to get to the profile creation form page (the new  
	action of the profiles_controller). This page is different for each user. rake  
	routes reveals that profiles#new was given a helper called `new_user_profile` which  
	takes them to a url for the particular user: `users/:user_id/profile/new`  
	Notice that is has a :key for user_id which is a required parameter. In order  
	to go to this page (via the helper) you must pass in the key for the `:user_id`  
	
	From this it looks like in order to get to this page we use the helper like this:  

		  new_user_profile_path(user_id: 1)

	Notice we appended with `_path` and we provided a static user_id. We obviously  
	don't want everyone to be editing the profile for user # 1! We need it to be  
	the current user's id dynamically. The devise gem gives us a variable `current_user`  

		  new_user_profile_path(current_user)
		  
	`current_user` returns a key value pair for the current user. The key is `user_id`.
		  
	If no user is currently logged on, `current_user` will evaluate to false. The  
	link will take them to an error page. There is no reason for the link to even  
	appear if no user is logged in and we can use use `current_user` as a boolean  
	to hide the link by adding `if current_user`
	
	Add the following line to the very top of app/views/pages/home.html.erb  

		  <%= link_to "Create your profile!", new_user_profile_path(current_user) if current_user %>

3. **Add to app/controllers/profiles_controller.rb**

	Once the user is at the custom url generated by the new action for their profile,  
	we need to make sure the controller provides the view with their own personal  
	variables. 
	
	We can grab the portion of the url that is the `user_id` with `params[:user_id]`  
	The User class has a method called .find that takes the `user_id` as an argument  
	and returns the user's hash. We will save this to a variable we call `@user`.  

		  def new
			 # form where a user can fill out their own profile.
			 @user = User.find( params[:user_id] )
			 @profile = @user.build_profile
		  end
	
	The last line creates a new @profile instance variable and sets it to the  
	result of calling `.build_profile` on the user object. `build_profile` is available  
	to us because we established the model associoations between users and profiles.  
	
4. **Experiment to Understand Parameters**
	
	*This is a good time to **git commit** since we will undo the changes in this step!*

	Both the @user and @profile variable are available in the view file for new  
	(app/views/profiles/new.html.erb). But lets do an experiment to prove it  
	
	Back on the home page, the call to new_user_profile_path() takes one parameter,  
	but if we overflow it with more arguments, they will be sent as **query string  
	parameters.** Change the call to:

		  new_user_profile_path(current_user, hello: 'world', hi: '101')

	Save this and go back to the home page to inspect the link to see something like:

		  <a href="/users/3/profile/new?hello=world&hi=101">

	3 is the user id and everything after `?` is the parameters, separated by `&`.  
	Now lets do something with the hello hash on the destination page.  
	
	Add this to the new action:

		  @variable = params[:hello]
		  
	and add this to new.html.erb:

		  <%= @variable %>

	Now let's revert to the last commit:

		  $ git checkout --force

--------------------------------------------------------------------------------
### 5.3 PROFILE NEW FORM
**Overview** We'll put the actual form in app/views/profiles/new.html.erb  
Commit this with message "Added profile form" 

1. **Create Form Element in Embedded Ruby**
  
		  <%= form_for @profile, url: user_profile_path do |f| %>
		  <!-- the entire form goes here !-->
		  <% end %>
	
	If you Look at rake routes you will see the POST verb for the profiles_controller  
	(profile#create) has the helper `user_profile_path`. This is our destination url.  
	The variable we want to work with is `@profile` since that's the variable we created  
	by calling `.build_profile` on the current user's object. profile is singular  
	and it applies to one user. If we were working on something plural for all users  
	we would not need the `, url: user_profile_path` second argument.   
	 
2. **Structure of a Form Field**
	
	Each user will be a div with the bootstrap class `form-field` for spacing.  
	The variable our `do` block is working with is `f` so wee will call methods on it.  
	
		  <%= form_for @profile, url: user_profile_path do |f| %>
		  
			 <div class="form-group">
				<%= f.label :first_name %>
				<%= f.text_field :first_name, class: 'form-control' %>
			 </div>
			 <!-- more field will go here !-->
			 
			 <% end %>
	
	The first line of erb is the displayed label and the second is the actual entry.  
	The second line has a the bootstrap class `form-control` for styling.  

3. **Fill in the Rest of Form**

	You can use db/schema.rb as your guide to the details of each field.  
	
	We want a drop down option for job title so we will use a different sort of  
	field here than the `.text_field`. We'll use `.select` instead and list the  
	options in an array of strings. You have to put and empty object after that  
	for other options. Description is a `.text_area` and the last is the `.button`  
	with the bootstrap classes `btn btn-primary`.
	
		  <%= form_for @profile, url: user_profile_path do |f| %>
			 <div class="form-group">
				<%= f.label :first_name %>
				<%= f.text_field :first_name, class: 'form-control' %>
			 </div>
			 <div class="form-group">
				<%= f.label :last_name %>
				<%= f.text_field :last_name, class: 'form-control' %>
			 </div>
			 <div class="form-group">
				<%= f.label :job_title %>
				<%= f.select :job_title, ['Developer', 'Entrepreneur', 'Investor'], {}, class: 'form-control' %>
			 </div>
			 <div class="form-group">
				<%= f.label :phone_number %>
				<%= f.text_field :phone_number, class: 'form-control' %>
			 </div>
			 <div class="form-group">
				<%= f.label :contact_email %>
				<%= f.text_field :contact_email, class: 'form-control' %>
			 </div>
			 <div class="form-group">
				<%= f.label :description %>
				<%= f.text_area :description, class: 'form-control' %>
			 </div>
			 <div class="form-group">
				<%= f.submit "Update Profile", class: 'btn btn-primary' %>
			 </div>
		  <% end %>
		  
4. **Surround the form in bootstrap**

	Well make it take up the middle third of the page:
	
		  <div class="row">
			 <div class="col-md-6 col-md-offset-3">
				<h1 class="text-center">Create Your Profile</h1>
				<p class="text-center">Be a part of the Dev Match community and fill out your profile!</p>
				<div class="well">
			 
			 <!-- form goes here !-->
			 
				</div>
			 </div>
		  </div>
		  
--------------------------------------------------------------------------------
#### 5.4 PROFILE CREATE ACTION  
**Overview** Now we will add the create action needed to save the profile in the  
profiles_controller. We first whitelist all of the fields into a single object  
we will choose to call `profile_params`, pass it into the `.build_profile` method  
on `@user` and then assign the return of that to `@profile`. The `@profile.save`  
will actually save it.

1. **Whitelist the fields into `profile_params`**
	
	This is app/controllers/profiles_controller.rb   
	
		  private
		  def profile_params
			 params.require(:profile).permit(:first_name, :last_name, :job_title, :phone_number, :contact_email, :description)
		  end
	
2. **Add the `create` action to take the parameters**

		  def create 
			 @user = User.find( params[:user_id] )
			 @profile = @user.build_profile(profile_params)
			 # next step is to insert here
		  end
		  
3. **Finish `create` action so that it saves the data and redirects**

		  if @profile.save
			 flash[:success] = "Profile Updated!"
			 redirect_to user_path( params[:user_id] )
		  else
			 render action: :new
		  end

	We added a flash notice upon success and we direct user_path which is not yet  
	created. It will be the profile show page and we should pass it the user_id.  

--------------------------------------------------------------------------------
### 5.5 USER SHOW ACTION

1. **Maunually create Action and View for showing user profiles*  

		  $ bundle exec rails generate controller Users index show
	 
	This also create two new routes in routes.rb which we will not need.  

3.  **Set User Instance Variable in Show Action**

	In users_controller.rb:

		  def show
			 @user = User.find( params[:id] )
		  end
		  
	You may woner why we have :id and not :user_id. If you look at rake routes you   
	will see why: `/users/:id(.:format)`. does not show user_id. 
		  
3. **app/views/users/show.html.erb** 

	Put a placeholder in the show file first:

		  <%= @user %>
		  
	Launch the rails server and fill out a profile to check it out. If it loads  
	the object, we now it's working. 
	 
	Now replace the placeholder with:

		<%= @user.profile.first_name %> <%= @user.profile.last_name %>
		<%= @user.profile.job_title %><br/>
		<% if current_user.plan_id == 2 %>
			<%= @user.profile.phone_number %><br/>
			<%= @user.profile.contact_email %><br/>
		<% end %>
		<%= @user.profile.description %><br/>
		  
	notice that we want the profile object with the user object. Upon that we can  
	ask for each field. Notice that the contact info is wrapped in an if. This is  
	to make sure only Pro account users can see it. What if the user has a Basic  
	plan but they want to see their own profile?  Change this later?  

--------------------------------------------------------------------------------
### 5.6 UPDATING THE NEW ACTION
**Overview** 
Right now we can create a profile but we can't edit it later. We can only create  
a new one and then show it. If the user tries to go to the url to show the profile  
themselves they will get an error because the association with profile is torn apart.  

There are a few changes we need to make. We would like to not show the create  
profile link once that have created one and instead show an edit profile link.  
We also want a safeguard in case they do someone get to the profile create page.  

It's also a good idea to hide sign up links if the user is already signed up.  

1. **Safeguard profile#new Page  QUESTIONABLE**  

	in app/controllers/profiles_controller.rb make this change this line in def new
	 
		  @profile = Profile.build_profile
		  
	To this, which unlinks the profile from the user:
	 
		  @profile = Profile.new

2. **Hide Sign-up Links For Users Already Signed in**  

	in app/views/pages/home.html.erb after div class="row" and before  
	div class="col-md-6", add the following:
	
		  <!-- <div class="row"> is here !-->
			 <% if user_signed_in? %>
				<%= link_to "Create your profile!", new_user_profile_path(current_user) if current_user %>
			 <% else %>
			 <!-- Buttons we already have !-->
			 <% end %>
		  <!-- last </div> is here-->
	 
	 user_signed_in? comes to us from devise. It's documented on their Github.  
	 We copied the link to create profile from the top of the page and pasted it.  
	 
	 We only want it to "create" a profile if the don't already have one. Of the  
	 people that are signed in, some return nil when `current_user.profile` is  
	 called. These people haven't made a profile yet. 
	 
			 <% if user_signed_in? %>
			 
				<% if current_user.profile>
				  <%= link_to "Edit your profile", "#" %>
				  <%= link_to "View your profile", user_path(current_user) %>
				  
				<% else>
				  <%= link_to "Create your profile!", new_user_profile_path(current_user) if current_user %>
				  
				<% end %>
	 
	We also added a paragraph to advertise creating the profile.  
	If you load the page without the current_user args you on user_path you will  
	get an errors because user_path needs an :id key as confirmed by rake routes.  
	
3. **Add some style in app/views/pages/home.html.erb**
		  
	REMOVED

4. **Stub Out Link to Community**
	
	Now let's stub out a link to the community: 

				<p>Visit the community to meet other developers, entrepreneurs, and investors!</p>
				<%= link_to "Visit the community", "#", class: 'btn btn-default btn-lg btn-block' %>

--------------------------------------------------------------------------------
### 5.7 USER EDIT ACTION 
**Overview** Commit with message "Added form partial + edit and update actions"  
We are going to make a form for user's who already have a profile so they can edit.  
We will also define the controller action for edit to provide variables for the view.  
We also need to fix the link to this edit profile page. Let's do that first;

1. **Fix the Link to Edit Profile**

	In app/views/pages/home.html.erb we stubbed out the link to the edit profile  
	page with `<%= link_to "Edit your profile", "#",`...etc. Lets change # to:
	
		  edit_user_profile_path(user_id: current_user.id)
	
	We could have had the argument simply be `current_user` but you should understand  
	the verbose, literal way. 

2. **Create Partial Form File**  

	It hardly makes sense to make a whole new form for editing a profile when it  
	look the same as the create profile form. Lets use a partial. 
	
	First make the file app/views/profiles/_form.html.erb. 
	
	Next cut the form from new.html.erb from <%= form_for ... to ... end %> and  
	paste it in _form.html.erb  
	
	In place of the cut form put `<%= render 'form' %>
	
3. **Create Edit File**

	Now you can copy the contents of new.html.erb and paste it in edit.html.erb.  
	Just change the word "Create" to "Edit"

4.**Define Controller Action for profile#edit**

	Right now the edit page doesn't and we get an error saying that @profile is nil.  
	This makes sense because we haven't set it in the controller profiles_controller.rb  
	
		  def edit
			 @user = User.find( params[:user_id] )
			 @profile = @user.profile
		  end
		  
	The first line should be very familiar. The second is familar as well but instead  
	of .new or .build_profile we just use .profile. This will prepopulate the form!  
	
5. **Profile Update Action**

	The only problem we have no is that the update button doesn't work.  
	In app/controllers/profiles_controller.rb:
	
		  ...
		  def update
			 @user = User.find( params[:user_id] )
			 @profile = @user.profile
			 if @profile.update_attributes(profile_params)
				flash[:success] = "Profile Updated!"
				redirect_to user_path( params[:user_id] )
			 else
				render action: :edit
			 end
		  end
		  ...
		  
	The else is in case it fails and it just brings them back to the edit page.  



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
	