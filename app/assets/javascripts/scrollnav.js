// This is a manifest file that'll be compiled which will include all the files
// listed blinkow.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a rlinkative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require turbolinks
//= 
//= require google_analytics.js

$( document ).ready(function() {
	
	// to fix navbar hiding to of content when linksing to spot in page
	// by offsetting by 50. REMEMBER TO ADJUST SCROLL LISTENER BY SAME VALUE!
	window.addEventListener("hashchange", function() { scrollBy(0, -50) });
	
	// initialize: 
	var $links = $('#toc').find('a');          // we'll need this a lot
	$(document).on("scroll", onScroll);        // add scroll listener on content
	$('a[href^="#"]').on('click', onTocClick); // add click listener on toc
	onScroll();	                               // run once on page load

	// click listener for toc
	function onTocClick (e) {   // e == object that raised the event
		e.preventDefault();           // bypass clicked <a>'s native bahavior 
		$(document).off("scroll");    // remove event handler on scroll
		$links.attr('id', 'inactive');
		
		$(this).attr('id', 'active');   // add our own active status to clicked <a> 
		
		var href = $(this).attr('href');
		window.location.hash = href; // update url in url bar to keep position
		
		var target = this.hash;
		var $target = $(target);
		$('html, body').stop().animate({
			'scrollTop': $target.offset().top+2
		}, 500, 'swing', function () {
			window.location.hash = target;
			$(document).on("scroll", onScroll);
		});
	}
	
	// listen to user and animated scrolling of content:
	function onScroll(event) {
		var scrollPosition = $(document).scrollTop(); // distace from top
		// var scrollPosition =  $('#body').offset().top;
		
		// Iterate all <a> descendant of <nav> (the links to locations)
		$links.each(function () { 
			var $currentLink = $(this)
			// var $prevActive = $links.find('#active');
			var refElement = $($currentLink.attr("href")); // get value of href attr
			 
			// check position of <a> in <nav>
			if (refElement.position().top + -50 // OFFSET 50 for navbar height + more 
				<= scrollPosition && refElement.position().top - 50 + 
				refElement.height() > scrollPosition) { // if it is near top of page:
				$links.attr('id', 'inactive');
				$currentLink.attr('id', 'active');        //  and add active to match
				
				tocScroller() // reposition table of contents
				
				var href = $currentLink.attr('href');
				window.location.hash = href; // update url in url bar to keep position
				
			}
		});
	}// END scroll tracker
	
	// update scrolling of toc by position in text:
	function tocScroller() {
		var toc = document.getElementById("toc");
		var activeElement = document.getElementById("active");
		var activePos = activeElement.offsetTop;
		var sidebarHeight = document.getElementById('sidebar').offsetHeight;
		var correction = -(activePos - sidebarHeight / 2)
		if (activePos > sidebarHeight * 0.90)
			$( "#toc" ).css('margin-top', correction);
		else 
			$( "#toc" ).css('margin-top', 0);
		}

});// END document.ready

