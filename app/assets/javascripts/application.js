// This is a manifest file that'll be compiled into application.js, which will include all the files
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
//= require_tree .

$( document ).ready(function() {
    
    // to fix navbar hiding to of content when linksing to spot in page:
    window.addEventListener("hashchange", function() { scrollBy(0, -50) });

});