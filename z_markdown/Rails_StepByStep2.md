
--------------------------------------------------------------------------------

# RAILS 4: DEVISE AND STRIPE

--------------------------------------------------------------------------------
### 4.1 GENERATE USER

		$ bundle exec rails generate devise SsUser
				invoke  active_record
				create    db/migrate/20151012001329_devise_create_ss_users.rb
				create    app/models/ss_user.rb
				invoke    test_unit
				create      test/models/ss_user_test.rb
				create      test/fixtures/ss_users.yml
				insert    app/models/ss_user.rb
				 route  devise_for :ss_users		
		$ bundle exec rake db:migrate
		$ bundle exec rails g devise:views
		
		
	
	
> Now start the server and go to /ss_users/sign_up ... boom. it's there.  

> Now lets make these forms look a little bit better. in views/ you will now see  
devise/. open up app/views/devise/registrations/new.html.erb and change to:  

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

> Also lets change app/views/devise/sessions/new.html.erb to:  

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
					<%= f.submit "Log in", class: 'btn btn-success' %>
				</div>
			  <% end %>
			  <%= render "devise/shared/links" %>
			</div>
		  </div>
		</div>

--------------------------------------------------------------------------------
### 4.2 NAVBAR USER LINKS

> Now we want to add the user signin/signup to the navbar.  
Open up app/views/layouts/application.html.erb  
Insert before the ul for "About" and "Contact Us" and just after the line  
<div class="collapse navbar-collapse" id="main-nav-collapse">  

	  <div class="nav navbar-nav navbar-right">
		<% if current_user %>
		  <%= button_to "Sign Out", destroy_user_session_path, method: :delete, class: 'btn btn-primary navbar-btn' %>
		<% else %>
		  <%= link_to "Log In", new_user_session_path, class: 'btn btn-primary navbar-btn', method: :get %>
		  <%= link_to "Sign Up", new_user_registration_path, class: 'btn btn-success navbar-btn', method: :get %>
		<% end %>
	  </div>
	  
> Take a look at the page now! now go to app/views/devise/sessions/new.html.erb  
We want to change the green Log in button  

		<%= f.submit "Log In", class: 'btn btn-success' %>
	
> To green, for consistancy:  

		<%= f.submit "Log In", class: 'btn btn-primary' %>
	
--------------------------------------------------------------------------------
### 4.3 DATABASE ASSOCIATIONS

> Relational Databases are needed to take credit card info to bill people.  
In Rails these are called database associations. We need to associate two  
different types of objects. A user is one type of object and something like a  
facebook status is another object. They need to be associated. If you google  
"rails associations" you should find the Rails Guides site. You will see you can  
have different types of associations like belongs_to, has_one, has_many, etc.  

> Your user account on FB has_many timeline posts. It has_one profile picture.  

> For our site, each user will belong_to either a free plan or playing plan.  
Likewise, each plan has_many users. It goes both ways.  

> To have a paid membership option we need to first make the application aware  
that it has it. Just like we did with the Contact object we'll create a new  
Plan object. The way we create a new object is we create a new Model file as well  
as adding an actual database table for that particular Model. First lets merge  
user_authentication into the development branch. Then from the development  
branch you should create a new branch called stripe_integration.  

> At this point skip to 2. Alternative Method if you prefer

1. Create a model and migration for create_plans

	What we need now is a database migration file. Generate it:  

		$ bundle exec rails generate migration CreatePlans
			 invoke  active_record
			create    db/migrate/20151012003604_create_plans.rb
	
	Now go to db/migrate/20141223183721_create_plans.rb and setup db table:  
		
		class CreatePlans < ActiveRecord::Migration
		  def change
			create_table :plans do |t|
			  t.string :name
			  t.decimal :price
			  t.timestamps
			end
		  end
		end

	Then run the actual migration:  

		$ bundle exec rake db:migrate
	
	Now we need to add a Model file for our database table. In models/ create plan.rb  
	
		class Plan < ActiveRecord::Base
		end

	Save all files. and go into the rails console to create the two plans:  

		$ bundle exec rails c
		> SsPlan.create(name: 'basic', price: 0)
		> SsPlan.create(name: 'pro', price: 10)
		> exit
		
2. **Alternative Method**

	We need a model file called plan.rb and a migration called _create_plans.rb
	We will need a string for name and a decimal for price. Timestamp will be  
	automatically. 
	
		$ rails generate model Plan name:string price:decimal
		
			invoke  active_record
			create    db/migrate/20151012020623_create_plans.rb
			create    app/models/plan.rb
			invoke    test_unit
			create      test/models/plan_test.rb
			create      test/fixtures/plans.yml
 
	Take a look at the migration file. It's generated perfectly! Take a look at  
	models/plan.rb. It's also perfect! 
	
	If you already ran the Plan.create command, even in a different git branch,  
	they are still there. Check with:
	
		$ bundle exec rails console
		> Plan.all
	
	If you don't get a readout of the basic and free plans then run: 
	
		> Plan.create(name: 'basic', price: 0)
		> Plan.create(name: 'pro', price: 10)
		> exit

3. **ASSOCIATIONS**
	
	Now we need to associate the users with the plans. google "rails associations".  
	Now in our Plan class Model:  

		class Plan < ActiveRecord::Base
		  has_many :users
		end

	Notice is users, plural. Now in the User class Model add this to the bottom:  

		belongs_to :plan
	
	Notice is plan singular. This is because a user can only belongs_to one plan  
	and a plan has_many users.  
	
4. **FOREIGN KEY**
	
	At this point we have two database tables: Plans and Users. We need to associate  
	those two tables with this concept called a foreign key. We will add another  
	column to the Users table called plan_id which can be either 'basic' or 'pro.'  
	Anytime we change something in our database, we generate a migration file:  

		$ bundle exec rails g migration AddSsPlanToSsUser
	
	Now in the file we just generated db/migrate/xyz_add_ss_plan_to_ss_user.rb: 

		class AddSsPlanToSsUser < ActiveRecord::Migration
		  def change
			add_column :ss_users, :ss_plan_id, :integer
		  end
		end
	
	This means to add a column to users. The column is plan_id and it's an integer.  
	We now have our assocations set up! Check out db/schema.rb to see out db tables.    
	
	Now we need to run this:  

		$ bundle exec rake db:migrate
		$ git add .
		$ git commit -m "Added association for plans and users"
		$ git push origin stripe_integration
	
--------------------------------------------------------------------------------
### 4.4 USER INTERFACE

> In the home page, lets add two huge buttons to the bottom of the body, one for  
signing up to basic and one for pro. Go to views/pages/home.html.erb:  

		<div class="jumbotron text-center">
		  <h1>Welcome to Dev Match</h1>
		  <h3>A membership site where entrepreneurs can meet developers.</h3>
		</div>
		<div class="row">
		  <div class="col-md-6">
			<div class="well">
			  <h2 class="text-center">Basic Membership</h2>
			  <h4>Sign up for free and get basic access to the community.</h4>
			  <br/>
			  <%= link_to "Sign up with Basic", new_user_registration_path, class: 'btn btn-primary btn-lg btn-block' %>
			</div>
		  </div>
		  <div class="col-md-6">
			<div class="well">
			  <h2 class="text-center">Pro Membership</h2>
			  <h4>Sign up for the pro account for $10/month and get access to the community and contact information!</h4>
			  <%= link_to "Sign up with Pro", new_user_registration_path, class: 'btn btn-success btn-lg btn-block' %>
			</div>
		  </div>
		</div>

> For now the two bottons both take us to the same sign up page. We want CC info in pro.  

> Also, our sign up link is no longer needed. Go to views/layouts/application.html.erb  
and remove it.  

	  $ git add .
	  $ git commit -m "Added sign up links to home page"
	  $ git push origin stripe_integration
	  
_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-__-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-
  
> Now lets make the CC info input form. app/controllers/pages_controller.rb:  
	
	  def home
		@basic_plan = Plan.find(1)
		@pro_plan = Plan.find(2)
	  end
	  
> These two instance variables are used on the home page since they are in the  
home method action. Plan with a capital P refers to the db table (active record obj).  
The find method allows us to pluck out a particular plan with that id. Go into console:  

		$ bundle exec rails c
		> Plan.all

> Do you see the IDs? 1 is basic and 2 is pro. find() is an active record method.  
Now that we have references to the two objects, we can use methods on them.  
for example:

		@basic_plan.id    // returns 1
		@basic_plan.name  // returns "basic"
  
> Now head over to views/pages/home.html.erb. Where you see this line:  

	  <%= link_to "Sign up with Basic", new_user_registration_path, class: 'btn btn-primary btn-lg btn-block' %>
	  
> Change it to:  

	  <%= link_to "Sign up with Basic", new_user_registration_path(plan: @basic_plan.id), class: 'btn btn-primary btn-lg btn-block' %>
	  
> (plan: @basic_plan.id) is the same as (plan: 1) but don't do that. Same for pro:  

	  <%= link_to "Sign up with Pro", new_user_registration_path(plan: @pro_plan.id), class: 'btn btn-success btn-lg btn-block' %>
	  
	  
> Now reload the page and look at the URL after clicking each button.  
You will see ?plan=1 and ?plan=2   Just with that, we can catch this info to  
change the way the form is presented. The notation we used with the () adds the  
query string parameter which is appended to the URL we go to with the link.  

		$ git add .
		$ git commit -m "Added plan variables and params to home page"
		$ git push origin stripe_integration
  
> Now we have the query string parameters but the form looks the same either way.  
What we can do now is add some if statements to the destination page.  

> In app/views/devise/registrations/new.html.erb at the top as the second line
(beween the lines `<div class="row">` and <`div class="col-md-4 col-md-offset-4">`):  

	  <div class="col-md-6 col-md-offset-3 text-center"> 
		<% if params[:plan] == '2' %>
		  <h1>Pro Account</h1>
		  <p>Sign up for the pro account for $10/month and get access to the community and contact information!</p>
		<% else %>
		  <h1>Basic Account</h1>
		  <p>Sign up for free and get basic access to the community.</p>
		<% end %>
	  </div>

--------------------------------------------------------------------------------
### 4.5 RAILS PARTIALS

> Now to display the fields of the form for CC input we will use a feature of rails  
called partials. We can divide our views out into these partials. Right click on  
app/views/devise/registrations/ and create new file called _basic_form.html.erb.  
The underscore means it's a partial. Now make _pro_form.html.erb.  

> Copy the entire form from app/views/devise/registrations/new.html.erb and paste  
it into _basic_form.html.erb. Now delete it in new.html.erb and replace it with  

		<%= render "basic_form" %>
  
> No extension or anything. But actually we only want to show that if it is basic.  
So instead of the above put this:  

	  <% if params[:plan] == '2' %>
		<%= render "pro_form" %>
	  <% else %>
		<%= render "basic_form" %>
	  <% end %>

> Now different partials will be shown depending on what link it clicked, but both  
partials are the same. For _pro_plan.html.erb, copy this:  


	  <div class="form-group">
		<%= label_tag :card_number, "Credit Card Number" %>
		<%= text_field_tag :card_number, nil, name: nil, class: "form-control" %>
	  </div>
	  <div class="form-group">
		<%= label_tag :card_code, "Security Code on Card (CVV)" %>
		<%= text_field_tag :card_code, nil, name: nil, class: "form-control" %>
	  </div>
	  <div class="form-group">
		<%= label_tag :card_month, "Card Expiration" %>
		<%= select_month nil, {add_month_numbers: true}, {name: nil, id: "card_month"}%>
		<%= select_year nil, {start_year: Date.today.year, end_year: Date.today.year+15}, {name: nil, id: "card_year"}%>
	  </div>
  
> and paste it below the div containing the password confirmation. Now refresh the  
page and the CC fields are there. It's a little cluttered though. In new.html.erb,  
change the div that contains the "well" to be:  

		<div class="col-md-6 col-md-offset-3">


--------------------------------------------------------------------------------
### 4.6 COMMUNICATING WITH STRIPE SERVERS

> sign up for stripe. Go to the dashboard and make sure you're in test mode.  
Go back to your Gemfile and add this:  
  
		# use stripe for handling payments
		gem 'stripe'
		
		# use figaro to hide secret keys
		gem 'figaro'
  
> Also, comment out this because it might conflict  

		# gem 'turbolinks'
  
> Then run  $ bundle install  Then disable turbolinks from our app.  
In app/views/layouts/application.html.erb, remove the following:  

		, 'data-turbolinks-track' => true
		, 'data-turbolinks-track' => true  
  
> in app/assets/javascripts/application.js remove this line:  

		//= require turbolinks
		
		$ git add .
		$ git commit -m "Added stripe keys"
		$ git push origin stripe_integration
  
> Go to your stripe dashboard and click on plans -> create your first plan.  

		ID    1           ID    2
		Name  Basic       Name  Pro
		Amount 0.0        Amount 10.0
  
> No go back to cloud9. We need to hide sensitive information from stripe.  

		$ bundle exec figaro install
  
> BTW .gitignore is a list of files not included in your git repo. This is useful  
for senstive data. 
  
> In app/config/intitializers/ create stripe.rb  

		Stripe.api_key = ENV["stripe_api_key"]
		STRIPE_PUBLIC_KEY = ENV["stripe_publishable_key"]
  
> In app/config/application.yml (Uncomment and put your keys in this file)  

		...
		# pusher_secret: abdc3b896a0ffb85d373
		stripe_api_key: sk_test_RE93dXx7wPZhAU41Of56vnp4
		stripe_publishable_key: pk_test_o3AtpVVVTUpb8zqsIh4bBdvc
		#
		# production:
		stripe_api_key: sk_test_RE93dXx7wPZhAU41Of56vnp4
		stripe_publishable_key: pk_test_o3AtpVVVTUpb8zqsIh4bBdvc
		  
		  $ git add .
		  $ git commit -m "Added stripe keys"
		  $ git push origin stripe_integration


> Stripe makes it so the web developer doesn't see the actual CC info. This is  
great because we don't have to handle security. We will write some JS code that  
prevents those fields from sending to our servers. The JS code will reach into  
the form and grap those 4 fields and send then to stripe's server. They will then  
send back a "Card Token" which is a string. We will then inject this back into  
our signup form as a hidden field.  

> What we will do server-side is write ruby that checks if the user is basic or pro.  
If the user is basic, devise gem just adds user to our database. If user is pro,  
devise saves user to database, but we also make another call to Stripe's servers  
this time we're telling Stripe to go ahead and create a customer and charge their  
card.  

> The inspiration for this approach is comming from a combination of resources.  
The stripe documentation itself is good, especially the tut by Larry Ullman.  

#
--------------------------------------------------------------------------------
### 4.7 ADDING HIDDEN FIELDS

> in _basic_form.html.erb add this below the second line:  

	<%= hidden_field_tag 'plan', params[:plan] %>
  
> If you go to the page and inspect it you will see there is an <input id="plan"  
type="hidden" value="1"> that you can't see. It is taking the query string  
parameter we send from the button on the home screen in home.html.erb, which uses  
variables defined in pages_controller.  

> Lets do the same for _pro_form.html.erb, under the second line:  

	<%= hidden_field_tag 'plan', params[:plan] %>
  
> Right now, the HTML generated by both the Basic and Pro buttons have the same id.  
If you inspect it you'll see id="new_user"  In our javascript that will we write  
we need to know the difference. 

> in _basic_form.html.erb change the first line to this:

	<%= form_for(resource, as: resource_name, url: registration_path(resource_name), html: {id: 'basic_form'}) do |f| %>
  
> We added    , html: {id: 'basic_form'}  
In the _pro_form.html.erb modify the body of the div containing the button to:  

	<%= f.submit "Sign up", class: 'btn btn-success', id: 'form-submit-btn' %>

> We added   , id: 'form-submit-btn'  
		
		$ git add .
		$ git commit -m "Updated forms for stripe"
		$ git push origin stripe_integration
  
--------------------------------------------------------------------------------
### 4.8 STRIPE JAVASCRIPT

> Now when submit is hidden, stripe will be sent a hidden field to tell them if it's  
basic or pro. Right now when a user hits sumbit for pro, it doesn't send anything  
back to our server. Things are sort of on hold pending a reply from stripe.  
Our javascript sends the CC info to stripe and we await the reply in the form of  
a Card Token which will inject as a hidden field.  

> We need to import a library into layouts/application.html.erb as the second and  
line fourth lines below the </title> 

		<title>Dev Match</title>
		<%= stylesheet_link_tag    'application', media: 'all' %>
		<%= javascript_include_tag "https://js.stripe.com/v2/", type: 'text/javascript' %>
		<%= javascript_include_tag 'application' %>
		<%= tag :meta, :name => "stripe-key", :content => STRIPE_PUBLIC_KEY %>
		<%= csrf_meta_tags %>

> Now create this file app/assets/javascripts/users.js  

		$(document).ready(function() {
		  Stripe.setPublishableKey($('meta[name="stripe-key"]').attr('content'));
		  // Watch for a form submission:
		  $("#form-submit-btn").click(function(event) {
			event.preventDefault();
			$('input[type=submit]').prop('disabled', true);
			var error = false;
			var ccNum = $('#card_number').val(),
				cvcNum = $('#card_code').val(),
				expMonth = $('#card_month').val(),
				expYear = $('#card_year').val();
			if (!error) {
			  // Get the Stripe token:
			  Stripe.createToken({
				number: ccNum,
				cvc: cvcNum,
				exp_month: expMonth,
				exp_year: expYear
			  }, stripeResponseHandler);
			}
			return false;
		  }); // form submission
		  function stripeResponseHandler(status, response) {
			// Get a reference to the form:
			var f = $("#new_user");
			// Get the token from the response:
			var token = response.id;
			// Add the token to the form:
			f.append('<input type="hidden" name="user[stripe_card_token]" value="' + token + '" />');
			// Submit the form:
			f.get(0).submit(); 
		  }
		});

		$ git add .
		$ git commit -m "Added stripe js"
		$ git push origin stripe_integration

  
> Now we need to create the user accounts on our end.  
  
> Create a new folder app/contollers/users and inside it, registrations_controller.rb  
Here we will override the default devise stuff. What would happen by default is  
devise would create a new user but we need to do a little bit more than that.  

		class Users::RegistrationsController < Devise::RegistrationsController
		  def create
			super do |resource|
			  if params[:plan]
				resource.plan_id = params[:plan]
				if resource.plan_id == 2
				  resource.save_with_payment
				else
				  resource.save
				end
			  end
			end
		  end
		end

> We are overriding the create method of the RegistrationsController class given to  
us by Devise. Now we to make save_with_payment in the model file  

> models/user.rb add this:  

	  def save_with_payment
		if valid?
		  customer = Stripe::Customer.create(description: email, plan: plan_id, card: stripe_card_token)
		  self.stripe_customer_token = customer.id
		  save!
		end
	  end
  
> Also, before this definition, add this:  

		attr_accessor :stripe_card_token
  
> Now we need to create a column in the database for stripe_customer_token.  

		$ bundle exec rails generate migration AddStripeCustomerTokenToUsers
  
> Now in the new db/migrate/xyz_add_stripe_customer_token_to_users.rb  

	  class AddStripeCustomerTokenToUsers < ActiveRecord::Migration
		def change
		  add_column :users, :stripe_customer_token, :string
		end
	  end
  
> Then run:  

		$ bundle exec rake db:migrate
  
> Now whenever we modify Devise like this we need to do the following whitelising  
of parameters. in app/controllers/application_controller.rb  

	before_filter :configure_permitted_parameters, if: :devise_controller?
	
	protected
	def configure_permitted_parameters
	  devise_parameter_sanitizer.for(:sign_up) { |u| u.permit(:name, :stripe_card_token, :email, :password, :password_confirmation) }
	end

> Now we need to tell our application to use this new registrations_controller.  
in the router, change the devise_for line to:  

		devise_for :users, controllers: { registrations: 'users/registrations' }
		
		$ git add .
		$ git commit -m "Updated routes file with new devise controller"
		$ git push origin stripe_integration
  

> Lets just do some minor improvements. Right now when someone signs up they get  
a crappy flash notice generated by Devise.  

> add this to app/assets/stylesheets/custom.css.scss  

		.alert-notice {
		  color: #8a6d3b;
		  background-color: #fcf8e3;
		  border-color: #faebcc;
		}
  
> next lets add some subtle improvements to our sign up forms. Right now if the  
user clicks on pro the url will have plan=2 at the end and plan=1 for basic.  
What happens if the user types plan=3 in the url bar? They will get basic.  
We don't want this to be possible.  
look at controllers/users/registrations_controller.rb  
What we need to add is what rails calls a "before filter"  

#
--------------------------------------------------------------------------------
### 4.9 RAILS BEFORE FILTER 

> If you go to the filters section of the guides.rubyonrails.org you find before filters.  
In controllers/users/registrations_controller.rb add this as the first line of class:  

		before_filter :select_plan, only: :new
  
> Then as the last thing in the class add this:  

	  private
		def select_plan
		  unless params[:plan] && (params[:plan] == '1' || params[:plan] == '2')
			flash[:notice] = "Please select a membership plan to sign up."
			redirect_to root_url
		  end
		end
	
	  $ git add .
	  $ git commit -m "Added notice and styles"
	  $ git push origin stripe_integration
  
----Lets push to heroku ---- redo this! -----
		
		$ git status
		$ git checkout development
		$ git merge stripe_integration
		$ git push origin development
		$ git checkout master
		$ git merge development
		$ git push origin master
		$ git push heroku master
		$ heroku run rake db:migrate
		$ heroku run rails console
		> SsPlan.create(name: 'basic', price: 0)
		> SsPlan.create(name: 'pro', price: 10)
		> exit
		$ heroku domains
		####console commands (Add your keys here after the '=')
		$ heroku config:set stripe_api_key=sk_test_xyz...
		$ heroku config:set stripe_publishable_key=pk_test_xyz...
  
  
--- stripe explanation ----
 