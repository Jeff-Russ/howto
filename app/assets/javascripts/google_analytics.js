

$( document ).ready(function() {
   
   // to fix navbar hiding to of content when linksing to spot in page
   // by offsetting by 50. REMEMBER TO ADJUST SCROLL LISTENER BY SAME VALUE!
   window.addEventListener("hashchange", function() { scrollBy(0, -50) });
   
   // google analytics:
   (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
   (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
   m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
   })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
   
   ga('create', 'UA-71741017-1', 'auto');
   ga('send', 'pageview');
   // END google analytics
   
});// END document.ready

