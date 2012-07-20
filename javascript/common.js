/** Awesome New Tab Page
  *   antp.co
  *   Copyright 2011-2012 Michael Hart (h4r7.me)
  * Want to make it even more awesome?
  *   github.antp.co
  *
  * Licensed under GPL v3:
  *   http://www.gnu.org/licenses/gpl-3.0.txt
  *   Further Restrictions:
  *     To make use of or modify the below code in any way:
  *     - You agree to leave this copyright and license notice intact without
  *       modification; and
  *     - You agree to mark your modified versions as modified from the original
  *       version; and
  *     - You agree not to misrepresent the origin of this material or your
  *       relationship with the authors of this project or the project itself.
***/

// Utility Functions
  var util = util || {};

  util.toArray = function(list) {
    return Array.prototype.slice.call(list || [], 0);
  };

// Variables that are relatively static

  var stock_widgets = {
    webstore: {
      where: [2,3],
      size: [1,1],
      isApp: true,
      enabled: true,
      name: "Chrome Web Store",
      color: "rgba(0, 16, 186, 1)",
      id: "webstore",
      stock: true,
      img: "app.webstore.png",
      simg: "app.webstore.png",
      appLaunchUrl: "https://chrome.google.com/webstore?utm_source=webstore-app&utm_medium=awesome-new-tab-page"
    },
    tutorial: {
      where: [0,0],
      size: [2,2],
      type: "iframe",
      isApp: false,
      stock: true,
      name: "Tutorial (Stock)",
      id: "tutorial",
      path: "widgets/tutorial/widget.tutorial.html"
    },
    clock: {
      where: [1,3],
      size: [1,1],
      type: "iframe",
      isApp: false,
      stock: true,
      name: "Clock (Stock)",
      id: "clock",
      path: "widgets/clock/widget.clock.html"
    },
    notepad: {
      where: [2,2],
      size: [1,1],
      type: "iframe",
      isApp: false,
      stock: true,
      name: "Notepad (Stock)",
      id: "notepad",
      path: "widgets/notepad/widget.notepad.html"
    },
    google: {
      where: [0,2],
      size: [1,2],
      type: "iframe",
      isApp: false,
      stock: true,
      name: "Google (Wide) (Stock)",
      id: "google",
      path: "widgets/google/widget.google.html"
    },
    fandango: {
      where: [2,1],
      size: [1,1],
      type: "app",
      isApp: true,
      enabled: true,
      stock: true,
      name: "Fandango (Stock)",
      name_show: false,
      color: "rgba(255, 51, 0,  1)",
      img: "/widgets/fandango/widget.fandango.png",
      simg: "/widgets/fandango/widget.fandango.png",
      appLaunchUrl: "http://gan.doubleclick.net/gan_click?lid=41000000032569141&amp;pubid=21000000000503246",
      id: "fandango"
    },
    amazon: {
      where: [1,2],
      size: [1,1],
      type: "app",
      isApp: true,
      enabled: true,
      stock: true,
      name: "Amazon (Stock)",
      name_show: false,
      color: "rgba(168, 84, 0,  1)",
      img: "/widgets/amazon/widget.amazon.png",
      simg: "/widgets/amazon/widget.amazon.png",
      appLaunchUrl: "http://www.amazon.com/?tag=sntp-20",
      id: "amazon"
    },
    facebook: {
      where: [0,4],
      size: [1,1],
      type: "app",
      isApp: true,
      enabled: true,
      stock: true,
      name: "Facebook (Stock)",
      name_show: false,
      color: "rgba(19, 54, 131,  1)",
      img: "/widgets/facebook/widget.facebook.png",
      simg: "/widgets/facebook/widget.facebook.png",
      appLaunchUrl: "http://www.facebook.com/",
      id: "facebook"
    },
    twitter: {
      where: [1,4],
      size: [1,1],
      type: "app",
      isApp: true,
      enabled: true,
      stock: true,
      name: "Twitter (Stock)",
      name_show: false,
      color: "rgba(51, 204, 255,  1)",
      img: "/widgets/twitter/widget.twitter.png",
      simg: "/widgets/twitter/widget.twitter.png",
      appLaunchUrl: "http://www.twitter.com/",
      id: "twitter"
    },
    tv: {
      where: [2,0],
      size: [1,1],
      type: "iframe",
      isApp: false,
      stock: true,
      name: "Hulu / Netflix (Stock)",
      id: "tv",
      path: "widgets/tv/widget.tv.html"
    },
    tabs: {
      id: "tabs",
      isApp: false,
      name: "Tab Manager (Stock)",
      path: "widgets/tabs/tabs.html",
      poke: 2,
      resize: true,
      size: [1,1],
      type: "iframe",
      v2: {
        min_height: 1,
        min_width : 1,
        max_height: 3,
        max_width : 3
      },
      where: [2,4]
    }
  };

  var palette =
    [
      "rgba(51,   153,  51,    1)",
      "rgba(229,  20,   0,     1)",
      "rgba(27,   161,  226,   1)",
      "rgba(240,  150,  9,     1)",
      "rgba(230,  113,  184,   1)",
      "rgba(153,  102,  0,     1)",
      "rgba(139,  207,  38,    1)",
      "rgba(255,  0,    151,   1)",
      "rgba(162,  0,    225,   1)",
      "rgba(0,    171,  169,   1)"
    ];

  var gradient = ", -webkit-gradient( linear, right bottom, left top, color-stop(1, rgba(255, 255, 255, .04)), color-stop(0, rgba(255, 255, 255, 0.35)) )";
  var amazon_regex = new RegExp("amazon\.(com|cn|co\.uk|at|fr|de|it|co\.jp|es)[/]{0,1}[\?]{0,1}");

  // For Google Analytics
  var _gaq = _gaq || [];

// Check if there are stored widgets
if(localStorage.getItem("widgets") === null) {
  // If not, use stock widgets
  localStorage.setItem("widgets", JSON.stringify( stock_widgets ));
}

// Load widget settings
var widgets = JSON.parse(localStorage.getItem("widgets"));

// if widget paths are old, update them to new one
function updateOldPaths() {
  var oldPathReg = /widgets\/(widget.([^.\/]*).[^\/]*)/, 
    pathChanged = false;
  for (var i in widgets) {
    if (widgets[i].stock) {
      if (widgets[i].path || widgets[i].img || widgets[i].simg) {
        var oPath = widgets[i].path || widgets[i].img || widgets[i].simg, 
          result;
        result = oldPathReg.exec(oPath);
        if (result) {
          var newPath = "/widgets/" + result[2] + "/" + result[1];
          pathChanged = true;
          //update path
          if (widgets[i].path) {
            widgets[i].path = newPath;
          }
          if (widgets[i].img) {
            widgets[i].img = newPath;
          }
          if (widgets[i].simg) {
            widgets[i].simg = newPath;
          }
        }
      }
    }
    else if (widgets[i].id = "tabs" && widgets[i].path == "widgets/tabs.html") {
      pathChanged = true;
      widgets[i].path = "widgets/tabs/tabs.html";
    }
  }
  if (pathChanged) {
    localStorageSync(false);
  }
}
updateOldPaths();

// Clears localStorage
  $("#reset-button").live("click", function(){
    var reset = confirm( chrome.i18n.getMessage("ui_confirm_reset") );
    if ( reset === true ) {
      deleteShortcuts();
      deleteRoot();
      localStorage.clear();
      _gaq.push(['_trackEvent', 'Reset', chrome.app.getDetails().version]);

      setTimeout(function() {
        reload();
      }, 250);
    } else {
      $.jGrowl("Whew! Crisis aborted!", { header: "Reset Cancelled" });
    }
  });

// Reload page
function reload() {
  window.location.reload( true );
}

// Save changes to the widgets variable in localStorage & optionally refresh
function localStorageSync(refresh) {
  localStorage.setItem("widgets", JSON.stringify( widgets ));

  if(refresh === true) {
    reload();
  }
}

// Generate a GUID-style string, such as "96b78e42-df07-b6a1-50d1-e8848fa5f788"
function new_guid() {
  var S4 = function() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function _e(_eNum) {
  console.log("Error #"+_eNum);
  _gaq.push(['_trackEvent', 'Error', _eNum]);
}

/* URL Handler :: Start */

  var url_handler = false;
  $(document).on("mousedown", ".url", function(e) {

    var url = $(this).attr("data-url");

    if ( url && typeof(url) === "string" && url !== "" ) {
      url_handler = url;
    } else {
      url_handler = false;
    }

    $(this).attr("href", url);

    if ( ( e.which === 2 )
    ||   ( e.ctrlKey === true && e.which !== 3 ) ) {
      $(this).attr("href", null);
    }
  });

  $(document).on("mouseup", document, function(e) {
    url_handler = false;
  });

  $(document).on("mouseup", ".url", function(e) {

    var url = $(this).attr("data-url");

    if ( url && typeof(url) === "string" && url !== ""
    &&   url_handler && url_handler === url ) {

      // Update Amazon.com URLs to TLD of user-preference
      if( url.match(amazon_regex)
      &&   localStorage["amazon-locale"] !== null
      &&   localStorage["amazon-locale"] !== ""
      &&   typeof(localStorage["amazon-locale"]) !== "undefined" ) {
        url = "http://www." + localStorage["amazon-locale"] + "/?tag=sntp-20";
      }

      // Ctrl + Click = Open in new tab
      if ( e.which !== 3 && e.ctrlKey === true ) {
        e.which = 2;
      }

      if ( e.shiftKey !== true ) {
        if ( e.which === 1 ) {
          if ( $(this).attr("pin") === "pin" ) {
            chrome.tabs.getCurrent(function(tab) {
              chrome.tabs.create({ url: (url), pinned: true });
              chrome.tabs.remove( tab.id );
            });
          } else if ( url.match(/^(http:|https:|chrome-extension:)/) ) {
            window.location = url;
          } else {
            // Left click, open a new one and close the current one
            chrome.tabs.getCurrent(function(tab) {
              chrome.tabs.create({ url: (url) });
              chrome.tabs.remove( tab.id );
            });
          }
        } else if ( e.which === 2 ) {
          chrome.tabs.create({ url: (url), active: false });
        }
      }
    }

    $(this).delay(100).queue(function() {
      $(this).attr("href", url);
    });

    url_handler = false;
  });

  /* URL Handler :: End */