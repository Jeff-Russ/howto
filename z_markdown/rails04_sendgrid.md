
-------------------------------------------------------------------------------

## EMAIL WITH SENDGRID 
  
-------------------------------------------------------------------------------
### 1. Setup Heroku

You have already done this step in the setup but in case you haven't:

1. These modifications are made to Gemfile for Heroku compatibility:

		gem 'sqlite3', group: [:development, :test]

		# Use postgresql as the database for production
		group :production do
			gem 'pg'
			gem 'rails_12factor'
		end

2. Now we need to go in to the web and grab all the files associates with the Gems
		
		### in project root directory:  
		$ bundle install 

**Setup Heroku account**
	
1. Make and account at heroku.com with the same email address you used with github. 
2. Go to your email to complete the account creation. 
3. Make sure email is verified with github
4. Go back to cloud9 terminal:
	
in project root directory:

	$ heroku login
	$ jeffreylynnruss@gmail.com
	$ ******** (one cap, one non alpha-num)
	$ heroku keys:add
	$ Y
	$ heroku create
		
--------------------------------------------------------------------------------
### 2. Setup Sendgrid

Heroku has an add-on called Sendgrid which enables your site to send emails.  

	$ heroku addons:create sendgrid:starter
		
This command won't work if you haven't set up with sendgrid. Follow the site 
to enter your info. It may prompt you for your credit card info but don't worry, 
it won't charge you unless you send out something like 400 emails in a day. Add 
your card info at  https://heroku.com/verify. 

After you have done this you just run the same command again. The command 
enables sendgrid for this particular app over at heroku. It does not modify
your local project.

--------------------------------------------------------------------------------
### 3. Setup ActionMailer

**With this addition we have the final state of app/config/environment.rb**

	ActionMailer::Base.smtp_settings = {
	  :address => 'smtp.sendgrid.net',
	  :port => '587',
	  :authentication => :plain,
	  :user_name => ENV['SENDGRID_USERNAME'],
	  :password => ENV['SENDGRID_PASSWORD'],
	  :domain => 'heroku.com',
	  :enable_startstls_auto => true
	}
		
Lets have the server send out an email to us when someone successfully contacts us.  
Create a new file in app/mailers called contact\_mailer.rb. This is where we will 
set the desination email (which does not have to mirror the one registered with 
sendgrid or anywhere!).

**This is the final state of mailers/contact_mailer.rb**

	class ContactMailer < ActionMailer::Base
	  default to: 'example@example.com' # replace with your email address
	  
	  def contact_email(name, email, body)
	    @name = name
	    @email = email
	    @body = body
	    
	    mail(from: email, subject: 'Contact Form Message')
	  end
	end
		
This class inherits from the ActionMailer class in rails. The method contact_email 
will have a corresponding view and provide to it the instance variables that fill 
in the content of the email 
		
Lets make the view. In app/views/ make a new folder called contact\_mailer/ and 
a file inside it called contact\_email.html.erb  

**This it the final state of views/contact_mailer/contact_email.html.erb**

	<!DOCTYPE html>
	<html>
	  <head>
	  </head>
	  <body>
		<p>You received a message from the site's contact form, from <%= "#{ @name }, #{ @email }." %></p>
		<p><%= @body %></p>
	  </body>
	</html>
	
The instance variable above match those in the ContactMailer class. Now all we 
need to do it pass in the proper arguments. 

__Explanation:__

We have just created a class called ContactMailer which extents the ActionMailer 
class defined in Rails. It has a method called contact\_email which, together with 
it's view, will be used to form the email. To actually send an email we will have 
a line of code in another controller looking like this:

	ContactMailer.contact_email(name, email, body).deliver

--------------------------------------------------------------------------------
### 4. Contacts Model and Controller
	
Each time someone fills out the form to send us an email we will save it to our 
database before sending it to ourselves. We will have a controller called contacts 
which will have the URL for the form as well as a URL which takes the form 
submission, stores it to the DB with a model called Contact, and sends it. Lets
create the model, controller and views.

	$ rails generate model Contact name:string email:string comments:text
	$ rails generate controller contacts

Now in routes.rb
	
	resources :contacts

This makes the application aware of a number of URL patterns. You can view 
these in the console with `bundle exec rake routes`. Applications use what is 
called CRUD (Create Read Update Delete) to allow the user or app to manipulate 
data on the server. Rails specifically uses the paradym know as REST 
(Representational State Transfer) to represent the four verbs: 

	Create  Read    Update  Delete     -> CRUD   
									
	POST    GET     PUT     DELETE     -  Rails has these corresponding verbs  
						PATCH
							
In a very real sense, these verbs represent the different kinds of HTTP requests.
		
You will see these verbs in the routes we have generated. GET will be the form 
the user fills out and it will have a view at the URL /contacts/new which uses 
app/view/contacts/new.html.erb. 

Before we make the view file we need to have the action for it added to it's 
controller. Make the contents of app/controllers/contacts\_controller.rb be:

	class ContactsController < ApplicationController
	  def new
	    @contact = Contact.new
	  end
	end
		
--------------------------------------------------------------------------------
### 5. Form to Send Email

1. **Create a Basic View for the Form**
	
	Now lets put some Ruby + HTML code in our views/contacts/new.html.erb to create 
	form fields. As you may remember, @contact is a single, empty database record. 
	We will use the `form_for` Rails helper to access each field of the record. 
	
		<%= form_for @contact do |f| %>
			<%= f.label :name %>
			<%= f.text_field :name %>
		
			<%= f.label :email %>
			<%= f.email_field :email %>
		
			<%= f.label :comments %>
			<%= f.text_area :comments  %>
			
			<%= f.submit 'Submit'  %>
		<% end %>

The user fills out the page and hits submit 


--------------------------------------------------------------------------------
### 6. Sending the Email

At this point the submit button doesn't do anything. Go to your new.html.erb view. 
If you inspect the HTML that it put to the browser you will see that the entire 
form is inside of an HTML \<form\> element. 

	<form accept-character-set"UTF-8" action="/contacts" class="new_contact" id="new_contact" method="post">

This shows that when the submit button is clicked a POST request is sent to 
the /contacts. We are at url /contacts/new but what's at /contacts? 
If we go there we get an error. Rails has automatically determined that when the 
form it submitted it goes to /contacts. We get an error because it's missing code. 

If you $ bundle exec rake routes you will see one that says GET and one that says 
POST, both of which are associated to the URI pattern /contacts. The two have 
different methods associated with them, with GET being assoicated with 
contacts#index and POST being associated with contacts#create. 

The actual contents of the form get sent over to the /contacts url via a 

**"query string parameter"**  

All that means is that the actual url is custom and looks something like 
thesite.com/contacts?name=test&email=test& etc... 
Everything after the ? is the query string parameter.

The action that takes the post request is called create and it should be defined 
in the contacts controller. In addition to this method we also need a method used 
by rails for security. It's called contact_params and it is used by Rails to 
whitelist the query string parameters to only be the ones we have defined. 

Here is the final state of app/controller/contacts_controller.rb

	class ContactsController < ApplicationController
	  def new
	    @contact = Contact.new
	  end
	  
	  def create
	    @contact = Contact.new(contact_params)
	    
	    if @contact.save
	      name = params[:contact][:name]
	      email = params[:contact][:email]
	      body = params[:contact][:comments]
	      
	      ContactMailer.contact_email(name, email, body).deliver
	      
	      flash[:success] = 'Message sent.'
	      redirect_to new_contact_path
	    else
	      flash[:danger] = 'Error occured, message has not been sent.'
	      redirect_to new_contact_path
	    end
	  end
	  
	  private
	    def contact_params
	      params.require(:contact).permit(:name, :email, :comments)
	    end
	end

contact\_params is the query string parameter. We define contact\_params using the 
method you see above which you should learn about. It falls under what rails calls 
"strong parameters" which are whitelisted for security reasons. This is new in 
Rails 4. 

We want to send the email in the if statement block before the flash message. 

	if @contact.save
		name = params[:contact][:name]
		email = params[:contact][:email]
		body = params[:contact][:comments]
		
		ContactMailer.contact_email(name, email, body).deliver
		
Note the `params[:contact][:name]` syntax is called hash syntax. params is the hash. 
To understand this we can look at the console that has the app running to monitor 
submitted forms. If you submit a form and look at the console you will see 
Parameters: {..."contact"=>{"name"=>"test", "email"=>""...} } 
These are your query string parameters which are in hash notation. I think it's 
a hash within a hash but I'm not sure. 

After you have entered this code, save it and go to the contact us page. Enter in 
some data and hit submit. The page will just reset to empty fields for now. But... 
go to the rails console:

	$ bundle exec rails console
	$ Contact.all
	
You will see your data saved there!  

At this point the data is being stored to the database. By data we mean the name, 
email and comment. The rest of the data like id, created at, etc haven't been 
established yet. This line: 

	if @contact.save

is the line that does the saving. This line just redirects (reloads) the page: 

	redirect_to new_contact_path

--------------------------------------------------------------------------------
### 7. Using Rails Console w/ DB

Lets use the rails console to simulate what the new action from the class 
contacts_controller does. 
	
	$ bundle exec rails console
	$ Contact.new

The console will print out the details of the object. You can also use the 
`@contact` variable and assign to each of the Contact object's fields. 

	$ @contact = Contact.new
	$ @contact
	$ @contact.name = "John Doe"
	$ @contact.email = "friend@friend.com"
	$ @contact.save
		
The last command actually saves it to our database. Lets look at our first row: 

	$ Contact.first

You could also declare a variable and have it set to `Contact.first` 
	
	$ first_contact = Contact.first
	$ first_contact.name 		# access the name field
	$ exit 							# or control-d
		
	**heroku run console**
	
In your local terminal if you run the following you can sift through the 
database there in the same way. 
	
	$ heroku run console
		
--------------------------------------------------------------------------------
### 8. The Flash Hash Explained

We need to give the user some reassuring feedback when the form has submitted. 
We already have this added in our views/layouts/application.html.erb but here 
is an explanation

	flash[:success] = 'Message sent.'
	
This gives the flash a key of "success." and value of "Message sent." in the else: 

	flash[:danger] = 'Error occured, message has not been sent.'
	
And you can get rid of the "notice:" parts that where there. Now go to 
views/layouts/application.html.erb and add just before <%= yield %> 

	<% flash.each do |key, value| %>
	  <%= content_tag :div, value, class: "alert alert-#{key}" %>
	<% end %>

This gives the flash a div. It loops through any flash messages and if it finds 
any it puts the key in the class name, and the value as the content of the div. 
The reason we choose the class name alert and alert-error / alert-success is 
because they come from bootstrap. 


--------------------------------------------------------------------------------
### 9. Form Validation

At this point we can input a totally blank form and it will submit it. No good. 

Google "active record validations" you will find a page on railsguide which is 
a great site. It explains a lot. There are lots of ways but for now we will 
use "presence" to our model file. 

This is the final state of app/models/contact.rb 

	class Contact < ActiveRecord::Base
	  validates :name, presence: true
	  validates :email, presence: true
	end

Validation in the Contact class could prevent the .save method from working. 

2. **Improve View for the Form with Bootstrap**

	This is the final state of views/contacts/new.html.erb
	
		<div class="row">
			<div class="col-md-4 col-md-offset-4">
				<div class="well">
				
					<%= form_for @contact do |f| %>
					
						<div class="form-group">
							<%= f.label :name %>
							<%= f.text_field :name, class: 'form-control' %>
						</div>
						
						<div class="form-group">
							<%= f.label :email %>
							<%= f.email_field :email, class: 'form-control' %>
						</div>
					
						<div class="form-group">
							<%= f.label :comments %>
							<%= f.text_area :comments, class: 'form-control' %>
						</div>
					
						<%= f.submit 'Submit', class: 'btn btn-default' %>
						
					<% end %>
				</div>
			</div>
		</div>
	
3. **Adding contacts/new to the Navbar**		

	open up app/views/layouts/application.html.erb which is our, sort of universal 
	layout. copy `<li><$= link_to "About", about_path %></li>` and paste as the next 
	line. Then change it so it looks like this: 

		<li><$= link_to "About", about_path %></li>
		<li><%= link_to "Contact Us", new_contact_path %></li>
	
	about\_path was generated for us, as was new\_contact\_path, both from routes.rb 
	To remind yourself of all of these go to console and type 

		$ bundle exec rake routes

	Notice that _path is not show, You need to append with _path





