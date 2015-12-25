--------------------------------------------------------------------------------

## IMAGES WITH PAPERCLIP
  
--------------------------------------------------------------------------------
### 1. ImageMagick & Paperclip setup

The Paperclip gem allows are site to have users upload photos. It requires   
software called ImageMagick to be installed. It may already be installed. Check:

	$ identify
	$ which convert

If that command results ouput you have the software. If not run this:

	$ sudo apt-get install ImageMagick
	
Next add this to Gemfile:

	# For image uploading
	gem 'paperclip', '4.2.1'
	
And lastly install the Gemfile

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

1. **app/views/profiles/_form.html.erb**  
	
	Add ", :html => { :multipart => true }" to line in app/views/profiles/\_form.html.erb
	
		  <%= form_for @profile, url: user_profile_path, :html => { :multipart => true } do |f| %>
	
	Add this form field in same file:
	
		  ...
		  <div class="form-group">
				<%= f.label :avatar %>
				<%= f.file_field :avatar, class: 'form-control' %>
		  </div>
		  ...
	
2. **Whitelist the Avatar Parameter**  
	
	add ":avatar" to line in app/controllers/profiles\_controller.rb
		...
		params.require(:profile).permit(:first_name, :last_name, :avatar, :job_title, :phone_number, :contact_email, :description)
		...

3. **Display Image on Show Page **  
	
	Add this to the top of app/views/users/show.html.erb:
	
		<%= image_tag @user.profile.avatar.url %>
		  
	Note that we can use Paperclip here but not on Heroku because Heroku won't  
	store media. You can Use Heroku together with Paperclip on Amazon S3!
		