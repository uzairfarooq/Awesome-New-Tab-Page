var _gaq = _gaq || [];
_gaq.push([ '_setAccount', 'UA-26076327-1' ]);
_gaq.push([ '_trackPageview' ]);

/* Non-Personal Statistics */
_gaq.push([ '_trackEvent', 'Version', chrome.app.getDetails().version ]);
if(localStorage.getItem("showbmb") !== null) {
  _gaq.push([ '_trackEvent', 'Bookmark Bar', localStorage.getItem("showbmb") ]);
}
if(localStorage.getItem("perm-grid") !== null) {
  _gaq.push([ '_trackEvent', 'Permanent Grid', localStorage.getItem("perm-grid") ]);
}
if(localStorage.getItem("bg-img-css") !== null && localStorage.getItem("bg-img-css") !== "") {
  _gaq.push([ '_trackEvent', 'Custom Background', "Yes" ]);
} else {
  _gaq.push([ '_trackEvent', 'Custom Background', "No" ]);
}

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();