
--------------------------------------------------------------------------------

## SETUP HEROKU

--------------------------------------------------------------------------------
### 1. Gemfile Update

Heroku is well known in the Ruby community. It's the most popular Rails host.
They have very elegant hosting and deployment setup that we would all benefit in
emulating even if we aren't hosting on Heroku. We push our app to Heroku and it
provides it with a domain name for deployment.

1. These modifications were made to Gemfile for Heroku compatibility:
	
		gem 'sqlite3', group: [:development, :test]
		
		# Use postgresql as the database for production
		group :production do
		  gem 'pg'
		  gem 'rails_12factor'
		end

2. If you just added this, you need to run bundle install in project root directory:
	
		$ bundle install 

------------------------------------------------------------------------------
### 2. Heroku Account

1. Make and account at heroku.com with the same email address you used with github. 
2. Go to your email to complete the account creation. 
3. Make sure email is verified with github
4. Go back to cloud9 terminal in project root directory:
	
		$ heroku login
		$ YOUREMAIL@gmail.com
		$ ******** (one cap, one non alpha-num)
		$ heroku keys:add
		$ Y
		$ heroku create
	
--------------------------------------------------------------------------------
### 3. Deploy to Heroku

Make sure you are on the master branch and all (stable) changes are merged in. 

	$ git push heroku master
	
--------------------------------------------------------------------------------
### 4. Troubleshooting Heroku

This grabs the latest copy from Git and sends it to the URL
If you go to your URL later and it's not there, that's okay, heroku sleeps it.
If you want to customize your domain name instead of using the one generated by
heroku, google domain keroku. If you want to view your domains or run console:

	$ heroku domains
	$ heroku run console
	
If you have trouble depolying you may want to check out `$ heroku logs` You 
may see that some database doesn't exist on the heroku version and in this case 
you can create it.Run this command whenever you alter your database:

	$ heroku run rake db:migrate
	
You can use the following command to reset the entire database. The command 
will simply drop and create the database. Afterward, run db:migrate. 

	$ heroku pg:reset DATABASE
	
Another way is to reset the db locally and then push it to Heroku:

	$ rake db:reset
	$ heroku db:push
	
This can be used to restart the app on Heroku if you are in the root directory 
of your rails application

	$ heroku restart

--------------------------------------------------------------------------------
### 5. Public Repos and Heroku

Rails uses keys to authorize deployment which should not be shared publicly. 
There is a filed called .gitignore found at the project root which lists files 
not to be tracked by git. The problem we run into is that Heroku has you use git 
to send up the code for deployment and that code will not include the key. There 
are a few solution to this such as the figaro and heroku_secrets gems. 

I find there is need for figaro, heroku\_secrets or any other gem. Secrets can be 
organized into two files: config/intializers/secret\_token.rb sets the 
secret\_key\_base environmental variable used in production. This file is created 
manually and should be added to gitignore. The second file is config/secrets.yml 
This file is also created manually and is NOT added to gitignore. It will set 
secret\_key\_base used in production using the environmental variable created in 
secret\_token.rb as well as setting secret\_key\_base for development and testing 
using strings. 

I also found no need to set the variables using Heroku CLI's heroku config:set 
command. Heroku will get and store the key without storing it to a file in the 
actual Rails app. 

In summary you will have three keys: development, test and production. You can 
generate these yourself with the command `rake secret`

__Added to .gitignore__

	config/initializers/secret_token.rb

__example config/initializers/secret_token.rb:__

	TheAppName::Application.config.secret_key_base = '' 

Note that the app name will always begin with a capital letter even if you didn't 
give it one when you generated it with `rails new`. The app's name is declared as 
a module in `config/application.rb`. Insert a key between '' that you generate 
with `rake secret`.

__example config/secrets.yml:__

Insert a keys between '' that you generated with `rake secret`. SECRET\_KEY\_BASE 
will take the value set in the gitignored secret_token.rb file. 

	development:
	secret_key_base: ''
	 
	test:
	secret_key_base: ''
	 
	production:
	secret_key_base: <%= ENV["SECRET_KEY_BASE"] %>

--------------------------------------------------------------------------------
### 6. Renaming Heroku Apps

__From the Heroku Website__ 

	$ heroku apps:rename newname
	 Renaming oldname to newname... done
	 http://newname.herokuapp.com/ | git@herokuapp.com:newname.git
	 Git remote heroku updated

Renaming an app will cause it to immediately become available at the new 
subdomain (newname.herokuapp.com) and unavailable at the old name 
(oldname.herokuapp.com). If you have custom domains configured that use these 
subdomains, for example a CNAME record set up that references 
oldname.herokuapp.com, then it will also need to be updated.

If you are using the CLI to rename an app from inside the Git checkout 
directory, your remote will be updated automatically. If you rename from the 
website or have other checkouts, such as those belonging to other developers, 
these will need to be updated manually:

	$ git remote rm heroku
	$ heroku git:remote -a newname

--------------------------------------------------------------------------------

## RAILS - GOOGLE DOMAINS

-------------------------------------------------------------------------------
### 1. Google Domains with Heroku

Instead of having your domain be a subdomain of herokuapp.com you can purchase 
your own domain and have it point to the Heroku app. One solution is to purchase 
one from google domains which is what will be explored here. In this example we 
have the app name MySite and the Heroku domain mysite.herokuapp.com. 

1. Sign up for Google Domains and purchase 'mysite.com'
2. Go to the DNS page
3. Under "Synthetic records" type "www" and click add.
4. Under "Custom resource records" add "www CNAME 1h mysite.herokuapp.com."

Now go over to your Heroku dashboard

1. Click on your app then go to the settings tab
2. Under "Domains" click "Add domain" type "mysite.com" (NO WWW) and submit
3. Click "Add domain" again and type your google domain WITH www and submit

Now you're DONE! It may take a few hour to take effect. Google says it could 
take 48 hours but for me it's usually in effect in a few minutes. Sometimes I'll 
enter "1m" instead of "1h" but I'm not certain if that makes any difference

--------------------------------------------------------------------------------
### 2. Google Subdomains with Heroku

You may choose to use the single Google domain name for many different apps. 
One solution is to have a main app at your Google domain and then create other 
Heroku apps which all are subdomains of your main app. We can arrange this so 
none of the URLs show "herokuapp" quite nicely.

Lets say we have the following rails apps with the corresponding heroku domains:

* mysite -mysite.herokuapp.com
* forum-forum.herokuapp.com
* blog -blog.herokuapp.com

If our Google domain is, for example, "http://www.mysite.com" we can create these:

* http://www.mysite.com
* http://forum.mysite.com
* http://blog.mysite.com

To this we go to "Custom resource records" at Google Domains and add these:

1. forum CNAME 1h mysite.herokuapp.com.
2. blog CNAME 1h mysite.herokuapp.com.

Now we need to tell Heroku about this. Go to the same place on the Heroku site, 
we will be using "Add domain" twice more:

1. add "forum.mysite.com"
2. add "blog.mysite.com"


