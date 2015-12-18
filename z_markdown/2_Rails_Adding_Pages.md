--------------------------------------------------------------------------------

# RAILS - ADDING PAGES
  
--------------------------------------------------------------------------------
### 1. About The Rails MVC

> 1\. THE REQUEST
		
		>> With Rails during development, he web server (WEBrick) on the hardware 
		server catches it and decides what to do. The web server looks for the Rails 
		application.
		
		>> The WEBrick server contacts the routes.rb file which lists controllers in
		in charge of each HTTP request and further details calls an appropriate action 
		(method) contained within it's controller (a Ruby Classs). The Ruby code in 
		the Controller folder talks to both the Model folder and the View folder and 
		sends back what it gets to the WEBrick server, which then sends it back to the client. 

> 2\. SERVER-SIDE PROCESSING
	
	>> The Ruby code in the Controller folder talks to both the Model folder and 
	the View folder/ 
	
	>> ### MVC - Model View Controller
	
	>> 1. controllers/____.rb file finds the appropriate code from the model and view.  
	
	>> 2. models/___.rb is typically the processing part of your web page.  
	It has access to the database that's stored on the server.  
	
	>> 3. views/___.html.erb is basically and HTML file containing the interface of the page. 

> 3\. THE RESPONSE

	>> The model and view both return their data back to the controller, which then  
	returns back to the WEBrick server, which finally send the response back to the  
	client. 

> 4\.	CLIENT-SIDE PROCESSING

	>> This will mainly be a Javascript running in the browser.
	
--------------------------------------------------------------------------------
### 2. Generating a Controller for Pages

>	We will create two pages, a home page and an about page. First need a controller to  
	handle the fetching of either view. Rails can generate this for us:  

		$ rails generate controller pages
		
>  This generates the following:

		app/controllers/pages_controller.rb
		app/views/pages/
		app/helpers/pages_helper.rb
		app/test/helpers/pages_helper_test.rb
		app/assets/javascripts/pages.js.coffee
		app/assets/stylesheets/pages.css.scss
		
>  The first two items are most notable. `app/controllers/pages_controller.rb` defines   
	a single class called `PagesController` which inherits from `ApplicationController`  
	It is empty now but we will put a method (know as an "action" in the context of rails)  
	for each page in this class definition.  

>  The second item is a directory and it is where we will put view files matching each  
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
		
2. **Adding a view to the action** 

	Right click on the app/view/pages/ and add new file home.html.erb. Note that  
	"home" mathes the name of the method we just made. This view is automatically  
	fetched when `pages#home` is called by the router.  

		<h2>Home</h2>
		
3. **Adding the about page**
	
	We already have the action for the about page in our controller. We only lack  
	the routing and the view. This is how the route is defined in config/routes.rb:  

	
	This syntax will be explained in the future. Lets add the corresponding view  
	in app/views/pages/. In that location, create `about.html.erb` and type this:  

		<h2>About Us<h2>
		
--------------------------------------------------------------------------------
### 4. The Quick Way

> We created the controller and views separately but there is a way to do all of 
this with one single command:

		$ rails generate controller pages home about
		
> This creates the controller with the two methods stubbed out and creates the 
two view files with some placemarker code. 