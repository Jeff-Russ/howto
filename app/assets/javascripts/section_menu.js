//= require jquery
//= require jquery_ujs
//= comments.js 


$( document ).ready(function(){
    setTimeout(section_menu, 1000);
    setTimeout(close_modal, 100);
	 
	var sectionMenu = $('#section-menu')

    var homeUrl = $( "#home" ).comments().html();// get subject from markdown comment
	sectionMenu.append("\
		<div class='col-xs-4 centered-div'>\
			<a class='dismiss btn btn-xlarge btn-block btn-warning \
			   btn-ghost modal-link' \
				href='" + homeUrl +"'>" + 'Home' + "\
				</a>\
		</div>");
	
	function section_menu() {
		var $sections = $('.section');
		var numOfSections = $sections.size();
		
		if ( numOfSections == 0) {
		    sectionMenu.prepend("<div class='col-xs-4'>");
		} else if (numOfSections == 1 ) {
			sectionMenu.prepend("<div class='col-xs-2'>");
		}  else {
			
		}
		var btnColors = ["info","success","primary","warning","danger"];
		var i = 0;
		$sections.each(function () { 
			sectionMenu.append("\
				<div class='col-xs-4'>\
					<a class='dismiss btn btn-xlarge btn-block btn-" + btnColors[i] + " \
					   btn-ghost modal-link' \
						href='#" + $(this).attr('id') + "'>" + $(this).attr('id') + "\
						</a>\
				</div>")	
			i = ++i % 5;
		})
		$('.dismiss').on('click', close_modal);
	}
	
	
	function close_modal() { 
		$( "button[data-dismiss='modal']").trigger("click")
	}
    
});// END document.ready










