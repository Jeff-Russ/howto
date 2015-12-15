--------------------------------------------------------------------------------

# RAILS 5. RAILS USERS WITH DEVISE
  
-------------------------------------------------------------------------------
### 5.1 SETUP DEVISE

> We will add multi-account functionality to the site with a Ruby Gem called Devise.  
> Add this to Gemfile:

		gem 'devise', '3.4.1'
		...
> Run this terminal commands which will fetch the gem online and install it:

		$ bundle install

> Google Devise and go to the Github. We will follow the direction you see there:  
	
		$ bundle exec rails generate devise:install 
		
> The generator will install config/initializers/devise.rb which sets all of 
Devise's config options. When you are done, you are ready to add Devise to any 
of your models using the generator:

		$ bundle exec rails generate devise User    # generates User model
				invoke  active_record
				create    db/migrate/20151012001329_devise_create_users.rb
				create    app/models/user.rb
				invoke    test_unit
				create      test/models/user_test.rb
				create      test/fixtures/users.yml
				insert    app/models/user.rb
				 route  devise_for :users	
				 
> This will create a model and configure it with default Devise modules and also 
configures your routes file to point to the Devise controller. It also created 
a migration so lets run it now.
		
		$ bundle exec rake db:migrate
		
__WHAT DOES DEVISE GIVE US?__

Devise creates helper functions to use inside your controllers and views. To 
restrict a controller to authenticated user, just add this before_action:

		before_action :authenticate_user!
		
> If we generated something other than user you would replace the word user above 
and below. Here are more helpers:

		user_signed_in?  # test if user is signed in
		current_user
		user_session
		
--------------------------------------------------------------------------------
### 5.2 DEVISE USER VIEWS

> Devise has it's views packages up inside the Gem and not the app. Since we want 
do define the views we use the following generator to give us access to the views 
inside our app:
		
		$ bundle exec rails g devise:views
		
			create    app/views/devise/shared/_links.html.erb
			create    app/views/devise/confirmations/new.html.erb
			create    app/views/devise/passwords/edit.html.erb
			create    app/views/devise/passwords/new.html.erb
			create    app/views/devise/registrations/edit.html.erb
			create    app/views/devise/registrations/new.html.erb
			create    app/views/devise/sessions/new.html.erb
			create    app/views/devise/unlocks/new.html.erb
			create    app/views/devise/mailer/confirmation_instructions.html.erb
			create    app/views/devise/mailer/reset_password_instructions.html.erb
			create    app/views/devise/mailer/unlock_instructions.html.erb
			
> If you have more than one Devise model in your app, such as User and 
Admin, you will notice that Devise uses the same views for all models. Fortunately, 
Devise offers an easy way to customize views. Check their documentation.

> Now start the server and go to /users/sign_up ... boom. it's there.  

--------------------------------------------------------------------------------
### 5.3 PLAN MODEL: BASIC + PRO
	
__DATABASE ASSOCIATIONS__

> We need to have a basic plan and a pro plan contained within a database 
model called Plan. Users will obviously have a relation to a Plan, which Rails 
calls "associations." Likewise, the basic and pro plans will each have many users.

> What we will do it create a model called Plan and then create two tables from 
that model; one for basic and one for pro. Each of these tables is basically a 
list of all the users that belong to it. 
		
1. Create Plan model

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
	
2. Create two Plans from the Model
	
	If you already ran the Plan.create command, even in a different git branch,  
	they are still there. Check with:
	
		$ bundle exec rails console
		> Plan.all
	
	If you don't get a readout of the basic and free plans then run: 
	
		> Plan.create(name: 'basic', price: 0)
		> Plan.create(name: 'pro', price: 10)
		> exit
	
--------------------------------------------------------------------------------
### 5.4 ADD PLAN TO USER

> For our site, each user will belong_to either a free plan or playing plan.  
Likewise, each plan has_many users. Now we need to associate the users with the 
plans. ow in our Plan class Model:  

		class Plan < ActiveRecord::Base
		  has_many :users
		end

	Notice is users, plural. Now in the User class Model add this to the bottom:  

		belongs_to :plan
	
	Notice is plan singular. This is because a user can only belongs_to one plan  
	and a plan has_many users.  
	
__FOREIGN KEY__
	
	At this point we have two database tables: Plans and Users. We need to associate  
	those two tables with this concept called a foreign key. We will add another  
	column to the Users table called plan_id which can be either 'basic' or 'pro.'  
	Anytime we change something in our database, we generate a migration file:  

		$ bundle exec rails g migration AddPlanToUser
	
	Now in the file we just generated db/migrate/xyz_add_plan_to_user.rb: 
	
		class AddPlanToUser < ActiveRecord::Migration
		  def change
			add_column :users, :plan_id, :integer
		  end
		end
	
	This means to add a column to users. The column is plan_id and it's an integer.  
	We now have our assocations set up! Check out db/schema.rb to see out db tables.    
	
	Now we need to run this:  
	
		$ bundle exec rake db:migrate
	
--------------------------------------------------------------------------------
### 5.5 PARTIALS & MORE ON QSP

> We will have a different form for the user to fill out depending on whether 
they're signing up for a basic or pro account. We could just make two different 
distinct pages for these two forms but this is a good chance to use a feature of 
Rails called partials. 

> Rails partials allow us to have a page display two different ways, using 
inserted eRuby from either one file or another. We will have two separate links 
on the home page and although they route to the same page, they will pass a 
different query string parameter depending on whether they clicked basic or pro. 

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
		  
> For now the two bottons both take us to the same sign up page. We want CC info in pro.  

> Also, our sign up link is no longer needed. Go to views/layouts/application.html.erb  
and remove it.  

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
### 5.6 RAILS PARTIALS

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

