--------------------------------------------------------------------------------

## 0. Overview

--------------------------------------------------------------------------------
#### 1. The session Object

Each Rails application has a session table which identifies each client and 
persists a small amount of data across each of their requests. Rails does this by  
assigning a seemingly random string to their cookie and uses it to associate each 
request with a particular session.

The cookies themselves are not large enough to contain actual user data and doing 
so would be a very insecure way to handle user authenticaion. Hackers would not 
have any meaningful way to manipulate the string contained in the cookies unless 
they had your secret_key_base which would allow them to become any user they want! 
 
 
.-------------------------------------------------------------------------------
#### 2. Sessions and Users

A post request can tell your app what user is signed in:

	class SessionsController < ApplicationController
	  ...
	  def create
	    ...
	    session[:current_user_id] = @user.id
	    ...
	    
	    
And a get request can query session information:

class UsersController < ApplicationController


.-------------------------------------------------------------------------------
## 0. The Plan

An authentication system is made up of signup, login, logout functionality. 
The password_digest column and has_secure_password method are provided by bcrypt 
to store passwords securely.

A session begins when a users logs in, and ends when a user logs out.

The current_user method allow us to access the current user; require_user 
redirects to the root of the app if there is no such user.

Before actions act as filters. They call methods before executing controller actions.


.-------------------------------------------------------------------------------
## 1. Signup

Store passwords as encrypted strings in the database. This is what the 
has_secure_password method helps with - it uses the bcrypt algorithm to securely
hash a user's password, which then gets saved in the password_digest column.

Then when a user logs in again, has_secure_password will collect the password that 
was submitted, hash it with bcrypt, and check if it matches the hash in the database.

1. Users controller - get '/signup' => 'users#new' - def new @user = User.new end 
2. users#new's submit => post '/signup' => 'users#create' => redirect_to '/'
3. User model has_secure_password 
4. User migration first_name:string last_name:string email:string password_digest:string

app/views/users/new.html.erb

    <%= form_for(@user) do |f| %>
      <%= f.text_field :first_name, :placeholder => "First name" %>
      <%= f.text_field :last_name, :placeholder => "Last name" %>
      <%= f.email_field :email, :placeholder => "Email" %>
      <%= f.password_field :password, :placeholder => "Password" %>
      <%= f.submit "Create an account", class: "btn-submit" %>
    <% end %>
    
Users controller

	def create 
	  @user = User.new(user_params) 
	  if @user.save 
	    session[:user_id] = @user.id 
	    redirect_to '/' 
	  else 
	    redirect_to '/signup' 
	  end 
	end

	private
	  def user_params
	    params.require(:user).permit(:first_name, :last_name, :email, :password)
	  end
	  
Fill in the signup form and submit it, the data is sent to the Rails app via a 
POST request. The request hits the User controller's create action. The create 
action saves the data, creates a new session, and redirects to the root page.

How is a new session created? Sessions are stored as key/value pairs. In the 
create action, the line

	session[:user_id] = @user.id
	
creates a new session by taking the value @user.id and assigning it to the key 
:user_id


.-------------------------------------------------------------------------------
## 2. Login
 
 1. Sessions controller - get /login => def new end
 2. sessions#new's submit => post '/login' => 'sessions#create' => redirect_to '/'
 
app/views/sessions/new.html.erb

	  <%= f.email_field :email, :placeholder => "Email" %> 
	  <%= f.password_field :password, :placeholder => "Password" %> 
	  <%= f.submit "Log in", class: "btn-submit" %>
	<% end %>
	
In the signup form, we used form_for(@user) do |f| since we had a User model. For 
the login form, we don't have a Session model, so we refer to the parameters here:

	<%= form_for(:session, url: login_path) do |f| %> 
	
This refers to the name of the resource and corresponding URL. 

sessions#create

	def create
	  @user = User.find_by_email(params[:session][:email])
	  if @user && @user.authenticate(params[:session][:password])
	    session[:user_id] = @user.id
	    redirect_to '/'
	  else
	    redirect_to 'login'
	  end 
	end
	
This create action checks whether your email and password exist in the database, 
creates a new session, and redirects to the albums page.


.-------------------------------------------------------------------------------
## 3. Logout

1. Sessions controller - delete '/logout' => 'sessions#destroy'

	def destroy 
	  session[:user_id] = nil 
	  redirect_to '/' 
	end


--------------------------------------------------------------------------------	
## 4. current_user 

1. Add def for current_user in ApplicationController
	
	helper_method :current_user 
	
	def current_user 
	  @current_user ||= User.find(session[:user_id]) if session[:user_id] 
	end
	
The current_user method determines whether a user is logged in or logged out. It 
does this by checking whether there's a user in the database with a given session 
id. If there is, this means the user is logged in and @current_user will store 
that user; otherwise the user is logged out and @current_user will be nil.

The line helper_method :current_user makes current_user method available in the 
views. By default, all methods defined in Application Controller are already 
available in the controllers.


2. Also add require_user
	
	def require_user 
	  redirect_to '/login' unless current_user 
	end

The require_user method uses the current_user method to redirect logged out users 
to the login page.

3. Add the following filter to the top of any controller to restrict access to 
signed in users only.

	before_action :require_user, only: [:index, :show]
	
The before_action command calls the require_user method before running the index 
or show actions.

4. Block out portions or views with this embedded ruby condition:

	<% if current_user %> 


--------------------------------------------------------------------------------
## 5. User Roles

There are various ways to have different levels of access to different users. If 
you want each user to only have one role - basic, pro, admin, editor, etc - then 
you can add a string column to the User db table which displays what role the user 
is. If you want Users to be able to have more the one role you might have a 
boolean column for each possible role. Lets do the former and have role be either 
editor, admin or nil.

After runnning this migration you can add methods to the User model class to query 
the db to check for the user's role:

	def editor? 
		self.role == 'editor' 
	end
	
	def admin? 
		self.role == 'admin' 
	end

Then you can create a methods in the application controller which will be used as 
a before actions in the various other controllers. 

	def require_editor 
	  redirect_to '/' unless current_user.editor? 
	end
	
	def require_admin
	  redirect_to '/' unless current_user.admin?
	end

Now in another controller you can can this before_action:

	before_action :require_editor, only: [:show, :edit]
	
	before_action :require_admin, only: [:destroy]
	
Now in the views you can hide links based on these:

	<% if current_user && current_user.editor? %> 
	  <p class="recipe-edit"> 
	    <%= link_to "Edit Recipe", edit_recipe_path(@recipe.id) %> 
	  </p> 
	<% end %>
	
	<% if current_user && current_user.admin? %> 
	  <p class="recipe-delete"><%= link_to "Delete", recipe_path(@recipe), method: "delete" %><p> 
	<% end %>