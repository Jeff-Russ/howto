--------------------------------------------------------------------------------

## SETUP APP

--------------------------------------------------------------------------------
### 1. Generate the App

__Set up environment with specified ruby and rails versions:__

To check Ruby and rails version:
   
	$ ruby -v
	$ rails -v
   
__To install Ruby and Rails specific version and create app:__

	$ gem uninstall rails
	$ gem uninstall railties
	$ gem install rails -v 4.1.0
	$ rails _4.1.0_ new MySite  generate web app dir and files
   
Specifying the version number it only needed if you have more than one installed.
If you want mySQL locally, run: `$ rails new MySite -d mysql`
	
__To install latest Ruby and Rails and create app__

	$ gem install rails
	$ rails new MySite  generate web app dir and files
	
--------------------------------------------------------------------------------
### 2. Install Gem Add-Ons
   
Rails uses add-ons called Gems which you can specify in the file called Gemfile. 
This file already has recommended gems listed in it, ready to install with the 
following command:

	$ cd <project/root/directory/>
	$ bundle update do this step only if the next one does not work alone
	$ bundle install --without production		 has remembered option
   
This remembered option means the next time you run `bundle install` it will retain.
Beware the running things like `bundle update` `bundle install`and
`bundle exec` will work without `bundle` but `bundle` insures that you run the
version used by your app project! Therefore it's much safer to prepend with it. 
   
If you want to verify what has been installed you can run

	$ gem list rails 	 to view only the rails gems
	$ gem list 			 to list all gems
	
__Customize Gemfile__
   
Take a look at the Gemfile you just installed from. 

If you use a Gemfile that was not generated by your install it must show the
same rails version as the one you have intalled on your system. You can have
multiple versions intalled and the Gemfile with dictate which version your app
will use.

Typically version numbers in Gemfiles are given as ranges but for learning it's good
to have exact version numbers. This means removing all ~and >= from this file.

here is the complete Gemfile as used in a project running Rails 4.1.0:

	source 'https://rubygems.org'
	
	gem 'rails', '4.1.0'  Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
	gem 'sqlite3', group: [:development, :test] 		 Use sqlite3 as db for Active Record
	
	# Use postgresql as the database for production
	group :production do
	gem 'pg'
	gem 'rails_12factor'
	end
	
	# See https://github.com/sstephenson/execjs#readme for more supported runtimes
	# gem 'therubyracer',platforms: :ruby 
	
	# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
	# gem 'turbolinks'
	
	gem 'sass-rails', '4.0.3'				 Use SCSS for stylesheets
	gem 'bootstrap-sass', '3.3.1'			 Use bootstrap library for styles
	gem 'font-awesome-sass', '4.2.0'		 Use font awesome library for icons
	
	gem 'uglifier', '1.3.0'					 Compressor for JavaScript assets
	gem 'coffee-rails', '4.0.0' 			 Use .js.coffee assets and views
	gem 'jquery-rails'						 Use jquery as JavaScript library
	gem 'jbuilder', '2.0'					 Build JSON APIs with ease
	gem 'sdoc', '0.4.0', group: :doc		 bundle exec rake doc:rails generates the API under doc/api.
	gem 'spring', group: :development	 speeds up dev by keeping app running in the bg. 
	
	gem 'devise', '3.4.1'					 Use devise for user auth
	# gem 'bcrypt', '3.1.7'					 Use ActiveModel has_secure_password
	
	gem 'stripe', '1.16.1'					 Use stripe for handling payments
	gem 'figaro', '1.0.0'					 Use figaro to hide secret keys
	
	gem 'paperclip', '4.2.1'				 Use paperclip for image uploads
	# gem 'aws-sdk-v1'  For Amazon's S3 service If using paperclip <= v4.3.1
	
	gem 'redcarpet', '~2.1.1' 			 for markdown support
	gem 'coderay', '~1.0.7'				 for markdown support
	
--------------------------------------------------------------------------------
### 3. Font Awesome Setup

Add this to Gemfile:

	# add font awesome library for icons
	gem 'font-awesome-sass'
	
Run this terminal command which will fetch the gem online and install it:

	$ bundle install
	
Add this to app/assets/stylesheets/application.css.scss:

	@import "font-awesome-sprockets";
	@import "font-awesome";
   
--------------------------------------------------------------------------------
### 4. Bootstrap Setup

Go to our Gemfile and add this anywhere logical and save the file:

	# adding bootstrap's gem
	gem 'bootstrap-sass'
   
Run this terminal command which will fetch the gem online and install it:

	$ bundle install 
   
Look at the docs for bootstrap-sass on github. Find and rename this file using
git's command rather than the normal one which results in a delete operation:

	$ cd app/assets/stylesheets 
	$ git mv application.css application.css.scss
   
Renaming this file lets the preprocessor know we will add SASS syntax to CSS
Now we will add these two lines to the bottom and hit save:

	@import "bootstrap-sprockets";
	@import "bootstrap";

If you read the bootstrap docs you will see that you need a javascript plugin.
Go to the docs on github.com/twbs/bootstrap-sass and you will see
Require Bootstrap JS in app/assets/javascripts/application.js 

Find that file and add below the line for jQuery:

	//= require bootstrap-sprockets

Without this, the site will adapt to some degree but not completely. For example,
if you have a navigation bar with a number of option they will compress into a menu
but the menu will not be functional without this inclusion.

--------------------------------------------------------------------------------
### 5. Launch Site Locally

Now let's launch the site privately:

	$ rails server -p 808						 Do this for local machines
	$ bundle exec rails server -p $PORT -b $IP 	 Do this for cloud9
   
You can grab the URL and open it anywhere else. When you are done coding you may
want to take it down by being in the terminal and hitting ctrl-c
If you ever need to know your IP address and/or your port you can...

	$ echo $IP
	$ echo $PORT
	
This shows a spash screen since we haven't created any pages yet. This works 
fine to test locally but if we tried to deploy to the live web we would not get 
this spash screen so we wouldn't be able to tell if the app was working or not. 

Lets temporarily add some content so we'll be able to deploy to the live web 
using Heroku. After we set up Heroku and launch the site we can delete this added 
content. Here is how to create a temporary home page and keep in mind this is 
not a normal way we would ever add content!

1. In the file app/controllers/application_controller.rb you will find a class 
   called ApplicationController. Add to it this method:
	
		def hello
		  render text: "hello, world!"
		end
	
   This method is also called an "action" and it usually corresponds to a page 
   on your site. Now lets tell the router to fetch it.
   
2. In config/routes.rb add the following as the second line:
   
		root 'application#hello'
   
3. Now launch the page locally again with one of these commands :
   
		$ rails server -p 808						 Do this for local machines
		$ bundle exec rails server -p $PORT -b $IP 	 Do this for cloud9

--------------------------------------------------------------------------------

## RAILS - SETUP GIT

--------------------------------------------------------------------------------
### 1. Setup Git Source Control

First make a Github or Bitbucket account and VERIFY YOUR EMAIL. 

Make sure your email address below is the same as you used with your Github or Bitbucket 
account. I don't think it matters if usernames match. When doing anything with git
always make sure you are at the project root. Do the following only once per computer: 
	
	$ cd <project/root/directory/>
	$ git config --global user.name "Your Name"
	$ git config --global user.email "your@email.com"
	$ git config --global push.default matching
	$ cat ~/.ssh/id_rsa.pub			 copy entire key.
					
Go to Github and click on settings for your profile. Click SSH keys and add key from above.
Now for the things done per-project... 						

Make a repository on Github. You'll probably want it to have the same name as your app.
Choose not to make a README.md. After you submit, on the next screen click SSH and copy.
Before we connect our local file to Github we need to have git setup locally:

	$ cd <project/root/directory/>
	$ git init		 this generates the git control files and folders
	
Rails uses .rdoc for readme files which is not what Github uses. Change the 
extension:

   $ git mv README.rdoc README.md
	
Before we start tracking our code we want to ignore certain files that have 
sensitive data, expecially if we have a public repo on Github. Even if the files 
don't yet exist, adding the following to the hidden file .gitignore will prevent 
them from ever being uploaded. 

See [here](https://help.github.com/articles/ignoring-files) for more about ignoring files.

	# TODO Comment out if OK with secrets being uploaded to the repo
	config/initializers/secret_token.rb
	config/secrets.yml

	# Ignore application configuration
	/config/application.yml

If you find yourself ignoring temporary files generated by your text editor
or operating system, you probably want to add a global ignore instead:

	$ git config --global core.excludesfile '~/.gitignore_global'
	
Now lets add and commit the project locally.
   
	$ git add -A get ready to add added files and delete deleted ones 
	$ git status	 to view everything that was added
	$ git commit -m "Initial commit"	 This commits everything locally
	
Next you get set the origin to be the version online. This mean two things: we connect
the local with online and we declare the online to be the "origin." The address
we type in below is the copied SSH not HTML. This means we don't have to keep logging on. 

	### always in project root directory!!
	$ git remote add origin git@github.com:yourusername/MySite.git  copied from SSH
	$ git remote					 to verify. you should see origin
	$ git push origin master	 This uploads our prior commits to the online repo
	
Deleted files are not updated with `git add .` so if you want to update any 
deleted files you should use git to remove them or run `git add -A`
	
--------------------------------------------------------------------------------
### 2. Git Routine Suggestions
	
**Your daily workflow routine**
   
To preview site on c9.io...

	$ bundle exec rails server-p $PORT -b $IP  ctrl-c to take down preview 
   
Keep server running. Open new terminal tab...

	### in project root directory:
	$ git status  If you see changes that you want to commit
	$ git add -A  add all and update deleted files (if needed)
	$ git status  check if it was added
	$ git commit -m "YOUR MSG"  local commit
	$ git push origin <branch>   push to github
	
Consider the master branch to be the one that is completed and deployed.
It should always mirror what is currently deployed to the live web. 

There is only one moment where it might now. Heroku (which we will use for 
deployment) can only be updated from the master branch. Just before you deploy 
you will have your updates on another "working branch" and not the master. Just 
before you deploy you will merge those update to the master branch and then deploy
from there. 

I recommend at least two other branches in addition to the master branch:

1. update - this is the candidate for the next update 
2. revert - this is a backup of the master as a mirror of previous deployment 

Here is how you create those:

	$ git checkout -b update  copies current (master) branch to a new one, locally
	$ git push origin update  uploads the new branch to Github (or whatever)
	$ git checkout -b revert  copies current (update) branch to a new one, locally
	$ git push origin revert  uploads the new branch to Github (or whatever)
	
You should not work off of the master branch. If you start to and haven't ran 
any commands to save it you are in luck. You can switch to another branch and save 
the changes there. Here is how you would save them to the update branch:

	$ git checkout update
	$ git add -A add the changes to update branch
	$ git commit -m "YOUR MSG" local commit
	$ git push origin update upload 
   
If, instead, you made change that you just want to discard you can run this:

	$ git checkout --force or -f