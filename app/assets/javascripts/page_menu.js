//= require jquery
//= require jquery_ujs
//= comments.js 


$( document ).ready(function(){
    setTimeout(page_menu, 200);
    
	var pageMenu = $('#page-menu');
	var root = location.protocol + '//' + location.host;
	
    var homeUrl = $( "#home" ).comments().html();// get subject from markdown comment
	pageMenu.append("\
		<div class='col-xs-4 centered-div'>\
			<a class='dismiss btn btn-xlarge btn-block btn-warning \
			   btn-ghost modal-link' \
				href='" + homeUrl +"'>" + 'Home' + "\
				</a>\
		</div>");
		

	function page_menu() {
		var $pages = $('.page-menu');
		var numOfPages = $pages.size();
		
		if ( numOfPages == 0) {
		    pageMenu.prepend("<div class='col-xs-4'>");
		} else if (numOfPages == 1 ) {
			pageMenu.prepend("<div class='col-xs-2'>");
		}  else { 
		}
		
		var btnColors = ["info","success","warning","primary","danger"];
		var i = 0;
		$pages.each(function () { 
			pageMenu.append("\
				<div class='col-xs-4 centered-div'>\
					<a class='dismiss btn btn-xlarge btn-block btn-" + btnColors[i] + " \
					   btn-ghost modal-link' \
						href='" + root + $(this).comments().html() +"'>" + $(this).attr('id') + "\
						</a>\
				</div>")	
			i = ++i % 5;
		})
	}
	
});// END document.ready










