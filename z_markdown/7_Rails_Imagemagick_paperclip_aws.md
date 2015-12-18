--------------------------------------------------------------------------------

# RAILS - IMAGEMAGICK PAPERCLIP AND AWS
  
--------------------------------------------------------------------------------
### 1. ImageMagick & Paperclip setup

> The Paperclip gem allows are site to have users upload photos. It requires   
software called ImageMagick to be installed. It may already be installed. Check:

		$ identify
		$ which convert

> If that command results ouput you have the software. If not run this:

		$ sudo apt-get install ImageMagick
		
> Next add this to Gemfile:

		# For image uploading
		gem 'paperclip', '4.2.1'
		
> And lastly install the Gemfile
	
		$ bundle install
		
--------------------------------------------------------------------------------
### 2. ImageMagick & Paperclip code

**Overview** 

To continue the addition of image uploading support we need to:

1. **Add to bottom of app/models/profile.rb**  
	This code comes from paperclip docs

		  has_attached_file :avatar, :styles => { :medium => "300x300>", :thumb => "100x100>" }, 
		  	:default_url => "http://i1377.photobucket.com/albums/ah75/Jeffrey_Russ/User_No-Frame_zpsf9q2vszh.png"
		  validates_attachment_content_type :avatar, :content_type => /\Aimage\/.*\Z/

2. **Create avatar-adding migration file**  
	We want to add the avatar as a db field for each user's profile and paperclip  
	has provided us with a generator to make the migration for it.

		  $ bundle exec rails generate paperclip profile avatar
	
	creates  db/migrate/20151106151127_add_attachment_avatar_to_profiles.rb
	
3. **db:migrate**

		  $ bundle exec rake db:migrate

--------------------------------------------------------------------------------
### 3. ImageMagick & Paperclip upload
**Overview** Commit with message "Added file fields for image upload on profiles"

1. **app/views/profiles/_form.html.erb**  
	
	Add ", :html => { :multipart => true }" to line in app/views/profiles/_form.html.erb
	
		  <%= form_for @profile, url: user_profile_path, :html => { :multipart => true } do |f| %>
	
	Add this form field in same file:
	
		  ...
		  <div class="form-group">
				<%= f.label :avatar %>
				<%= f.file_field :avatar, class: 'form-control' %>
		  </div>
		  ...

2. **Whitelist the Avatar Parameter**  

	add ":avatar" to line in app/controllers/profiles_controller.rb
		  ...
		  params.require(:profile).permit(:first_name, :last_name, :avatar, :job_title, :phone_number, :contact_email, :description)
		  ...

3. **Display Image on Show Page **  

	Add this to the top of app/views/users/show.html.erb:
	
		  <%= image_tag @user.profile.avatar.url %>
		  
	Note that we can use Paperclip here but not on Heroku because Heroku won't  
	store media. You can Use Heroku together with Paperclip on Amazon S3!
		
.-------------------------------------------------------------------------------	
### 4. Add Amazon AWS setup

https://devcenter.heroku.com/articles/paperclip-s3

> You will need to add the following gem in addition to the paperclip gem:

		gem 'aws-sdk'
		
> We need to specify the AWS configuration variables for the Environment.
> Add this to config/environments/production.rb and or development.rb

		config.paperclip_defaults = {
		  :storage => :s3,
		  :s3_credentials => {
		    :bucket => ENV['S3_BUCKET_NAME'],
		    :access_key_id => ENV['AWS_ACCESS_KEY_ID'],
		    :secret_access_key => ENV['AWS_SECRET_ACCESS_KEY']
		  }
		}

> Set the AWS configuration variables on the Heroku application

		$ heroku config:set S3_BUCKET_NAME=your_bucket_name
		$ heroku config:set AWS_ACCESS_KEY_ID=your_access_key_id
		$ heroku config:set AWS_SECRET_ACCESS_KEY=your_secret_access_key
		
.-------------------------------------------------------------------------------	
### 5. Add Amazon AWS code
		
> Now we need to define the file locations in our app. Add this to whatever model 
needs access to the image

		  # This method associates the attribute ":avatar" with a file attachment
		  has_attached_file :avatar, styles: {
		    thumb: '100x100>',
		    square: '200x200#',
		    medium: '300x300>'
		  }
		
		  # Validate the attached image is image/jpg, image/png, etc
		  validates_attachment_content_type :avatar, :content_type => /\Aimage\/.*\Z/

> The has_attached_file method also accepts a styles hash that specifies the 
resize dimensions of the uploaded image. The > and # symbols will tell 
ImageMagick how the image will be resized (the > will proportionally reduce the 
size of the image).

__Update database__

> A database migration is needed to add the avatar attribute on  Profiles in the 
database schema. Run the following rails helper method to generate a stub migration.

		$ rails g migration AddAvatarToProfiles

> Paperclip comes with the migration helper methods add_attachment and 
remove_attachment. They are used to create the columns needed to store image 
data in the database. Use them in the AddAvatarToProfiles migration.

		class AddAvatarToProfiles < ActiveRecord::Migration
		  def self.up
		    add_attachment :profiles, :avatar
		  end
		
		  def self.down
		    remove_attachment :profiles, :avatar
		  end
		end

> This migration will create avatar_file_name, avatar_file_size, 
avatar_content_type, and avatar_updated_at attributes on the  Profiles model. 
These attributes will be set automatically when files are uploaded.
Run the migrations with rake db:migrate to update your database.

__Upload form__

> Images are uploaded to your application before being stored in S3. This allows 
your models to perform validations and other processing before being sent to S3.

> Add a file input field to the web form that allows users to browse and select 
images from their local filesystem.Make sure the form has multipart: true added to it.

		<%= form_for(@profile, multipart: true) do |f| %>
		  <div class="field">
		    <%= f.label :name %>
		    <%= f.text_field :name %>
		  </div>
		  <div class="field">
		    <%= f.label :avatar %>
		    <%= f.file_field :avatar %>
		  </div>
		  <div class="actions">
		    <%= f.submit 'Make a profile' %>
		    <%= link_to 'Nevermind', profiles_path, class: 'button' %>
		  </div>
		<% end %>

> When the form is submitted and the backing models are successfully persisted 
to the database, the file itself will be uploaded to S3.

__Upload controller__

> With Rails 4 we’ll need to specify the permitted params. We’ll permit :name 
and :avatar in the params.

		class ProfilesController < ApplicationController
		  # Other CRUD actions omitted
		
		  def create
		    @profile =  Profiles.new(profile_params)
		
		    if @profile.save
		      redirect_to @profile, notice: ' Profiles was successfully created.'
		     else
		       render action: 'new'
		    end
		  end
		
		  private
		
		  def profile_params
		    params.require(:profile).permit(:avatar, :name)
		  end
		end

> Large files uploads in single-threaded, non-evented environments (such as 
Rails) block your application’s web dynos and can cause request timeouts and 
H11, H12 errors. For files larger than 4mb the direct upload method should be 
used instead.

__Image display__

> Files that have been uploaded with Paperclip are stored in S3. However, metadata 
such as the file’s name, location on S3, and last updated timestamp are all stored 
in the model’s table in the database.
Access the file’s url through the url method on the model’s file attribute (avatar 
in this example).

		profile.avatar.url #=> http://your_bucket_name.s3.amazonaws.com/...

> This url can be used directly in the view to display uploaded images.

		<%= image_tag @profile.avatar.url(:square) %>

> The url method can take a style (defined earlier in the  Profiles model) to access 
a specific processed version of the file.

__Paperclip Demo Application__

> As these images are served directly from S3 they don’t interfere with other 
requests and allow your page to load quicker than serving directly from your app.
Display the medium sized image by passing :medium to the url method.

		<%= image_tag @profile.avatar.url(:medium) %>

__Deploy__

> Once you’ve updated your application to use Paperclip commit the modified files 
to git.
		
		$ git commit -m "Upload profile images via Paperclip"

> On deployment to Heroku you will need to migrate your database to support the required file columns.

		$ git push heroku master
		$ heroku run bundle exec rake db:migrate