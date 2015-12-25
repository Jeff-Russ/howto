--------------------------------------------------------------------------------

## THE RAILS MVC
  
--------------------------------------------------------------------------------
### 1. About The Rails MVC

1. **THE REQUEST**
		
	During rails development, you will use the server rails comes with, called WEBrick
	to serve the pages to your own machine only and view them in your browser. This 
	server is for development stages only although it function much like any other. 
	
	The WEBrick server receives an HTTP request from the brower (client) and figures out
	what Rails app it is for based on the URL being requested. If the request is a GET
	request (user wants to SEE a page) then it uses the end part of the URL to determine 
	what files in the Rails application are needed to serve it back.  
	<br>
	
2. **SERVER-SIDE PROCESSING**
	
	The WEBrick server contacts the routes.rb file which hopefully has registered 
	what to do for the particular URL be requested. For each URL, Rails has a 
	controller#action pair. Think of your site as if it is many folder which each 
	folder containing one or more web pages. The folder is the controller and 
	action is the page. 
	
	In more concrete terms, a controller is a single source file containing a 
	single Ruby class which has a number of methods in it. If the controller name
	is `home` then the file will be called `home_controller.rb` and the class will
	be called `HomeController`. This correspondence is more than a convention, 
	it's a requirement. The controllers are found in `app/controllers`
	
	As for the `action` part of "controller#action" it usually has a matching 
	`view` file found in `app/views/CONTROLLERNAME/`. If we got an HTTP GET 
	request for `home#index` (which would probably be handling the URL
	`http://sitename.com/home/index`) The actual HTML for the page would be in 
	`app/views/home/index.html.erb`. Note the additional `erb` "Embedded Ruby" 
	extension. This means there is Ruby scattered throughout the file that will 
	be rendered to more HTML before it's sent back. 

	In addition to all this static stuff we might need to customize the page 
	according to what user is viewing it, for example. We might have account 
	information stored in the database and in this case we would talk to the 
	database with what's called a `model`.
	<br>
	
	#### MVC - Model View Controller
		
	1. app/controllers/home_controller.rb 
		
		Thi finds the appropriate files from the model and view. 
		
	2. app/models/users.rb 
		
		This is typically the processing part of your web page. It has access to 
		the database that's stored on the server. 
		
	3. app/views/index.html.erb 
		
		This is basically and HTML file containing the interface of the page.  
	<br><br>

3. **THE RESPONSE**
	
	The model and view both return their data back to the controller, which then
	returns back to the WEBrick server, which finally send the response back to the
	client.  
	<br>
	
4.	**CLIENT-SIDE PROCESSING**
	
	The response can contain Javascript, which runs in the browser.
	
--------------------------------------------------------------------------------

# ADDING PAGES
  
--------------------------------------------------------------------------------
### 1. Generating a Controller for Pages

We will create two pages, a home page and an about page. First need a controller to
handle the fetching of either view. Rails can generate this for us: 

	$ rails generate controller pages
		
This generates the following:

	app/controllers/pages_controller.rb
	app/views/pages/
	app/helpers/pages_helper.rb
	app/test/helpers/pages_helper_test.rb
	app/assets/javascripts/pages.js.coffee
	app/assets/stylesheets/pages.css.scss
		
The first two items are most notable. `app/controllers/pages_controller.rb` defines
a single class called `PagesController` which inherits from `ApplicationController`
It is empty now but we will put a method (know as an "action" in the context of rails)
for each page in this class definition.

The second item is a directory and it is where we will put view files matching each
method-action we add to the `pages_controller` class.
	
--------------------------------------------------------------------------------
### 3. Creating Home & About Views 
	
1. **Adding a route to the HTTP request**  
	
	The config/routes.rb file has an entry for each possible HTTP request from the
	user and has a action specified for each request. We want the home page to be
	the root of the site, meaning `sitename.com\` without anything added to the end.
	The routes file specifies the acion notated as: `controller#action`. In our
	we will make a method-action in our `PagesContoller` class called `home`
	Add the following as the second line of config/routes.rb:
		
		root 'pages#home'
		
	The second line will be for our about page. If you want to view all routes:
		
		$ rake routes
			
2. **Adding actions to controller** 
		
	Go to app/controllers/pages_controller.rb and the method-action for home.
	While we are here we might as well add one for about, even though we havn't routed it.
		
		def home
		end
		def about
		end
			
3. **Adding a view to the action** 
		
	Right click on the app/view/pages/ and add new file home.html.erb. Note that
	"home" mathes the name of the method we just made. This view is automatically
	fetched when `pages#home` is called by the router.
		
		<h2>Home</h2>
			
4. **Adding the about page**
		
	We already have the action for the about page in our controller. We only lack
	the routing and the view. This is how the route is defined in config/routes.rb:
		
	This syntax will be explained in the future. Lets add the corresponding view
	in app/views/pages/. In that location, create `about.html.erb` and type this:
		
		<h2>About Us<h2>
		
--------------------------------------------------------------------------------
### 4. The Quick Way

We created the controller and views separately but there is a way to do all of 
this with one single command:
	
	$ rails generate controller pages home about
		
This creates the controller with the two methods stubbed out and creates the 
two view files with some placemarker code. 