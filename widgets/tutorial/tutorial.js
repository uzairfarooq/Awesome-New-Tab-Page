var current = 1;
$("#next,#back").live("click", function(){
  if( $(this).attr("id") === "next") {
    current++;
  } else if( $(this).attr("id") === "back") {
    current--;
  }

  if(current == 1) {
    $("#back").css("display", "none");
  } else {
    $("#back").css("display", "block");
  }

  if (current == 5) {
    $("#next").css("display", "none");
  } else {
    $("#next").css("display", "block");
  }

  $("#1,#2,#3,#4,#5").stop().css("display", "none").css("opacity", "1");
  $("#"+current).fadeIn();
});


$(window).load(function() {
  loadPlusOneScript();
  loadTwitterScript();
  loadFlattrScript();
});

function loadPlusOneScript() {
  var po = document.createElement('script');
  po.type = 'text/javascript';
  po.async = true;
  po.src = 'https://apis.google.com/js/plusone.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
}

function loadTwitterScript() {
  var twitterScriptTag = document.createElement('script');
  twitterScriptTag.type = 'text/javascript';
  twitterScriptTag.async = true;
  twitterScriptTag.src = 'https://platform.twitter.com/widgets.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(twitterScriptTag, s);
}

function loadFlattrScript() {
  var s = document.createElement('script'),
  t = document.getElementsByTagName('script')[0];
  s.type = 'text/javascript';
  s.async = true;
  s.src = 'https://api.flattr.com/js/0.6/load.js?mode=auto&popout=0&https=1';
  t.parentNode.insertBefore(s, t);
}
