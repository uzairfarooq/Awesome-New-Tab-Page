  /*
     -
     -  Awesome New Tab Page
     -    http://antp.co/
     -    Copyright 2011+ Michael Hart (http://h4r7.me/).
     -
     -  Want to make it even more awesome?
     -    https://github.com/michaelhart/Awesome-New-Tab-Page/
     -
     -  background.html
     -    Where every journey begins.
     -
     -  Licensed under GPL v3:
     -    http://www.gnu.org/licenses/gpl-3.0.txt
     -
     */
window.setTimeout(' window.location = window.location; ', 1*60*60*1000);

/* START :: Recently Closed Tabs & Tab Manager Widget */
var recently_closed = JSON.parse(localStorage.getItem("recently_closed"));
chrome.tabs.onRemoved.addListener( onRemoved );
function onRemoved(tabId) {
  var tab = tabs.filter(function (tab) { return tab.id === tabId})[0];

  if (recently_closed === null ) {
    recently_closed = [];
  }

  if ( !tab || tab.incognito === true
    || tab.title === ""
    || (tab.url).indexOf("chrome://" ) !== -1 ) {
    return;
  }

  recently_closed.unshift({title: tab.title, url: tab.url});

  if(recently_closed.length > 15) {
    recently_closed.pop();
  }

  localStorage.setItem("recently_closed", JSON.stringify( recently_closed ));

  getAllTabs();
}

chrome.tabs.onMoved.addListener( getAllTabs );
chrome.tabs.onCreated.addListener( getAllTabs );
chrome.tabs.onUpdated.addListener( getAllTabs );
chrome.tabs.onHighlighted.addListener( getAllTabs );

var tabs = null;
function getAllTabs() {
  chrome.tabs.getAllInWindow(null, getAllTabs_callback);
}
function getAllTabs_callback(data) {
  tabs = data;
  localStorage.setItem("open_tabs", JSON.stringify( tabs ));
}
chrome.tabs.getAllInWindow(null, getAllTabs);

/* START :: Tab Manager Widget */

  $(window).bind('storage', function (e) {
    if ( e.originalEvent.key === "switch_to_tab" ) {
      if (localStorage.getItem("switch_to_tab") != -1) {
        var id = parseInt(localStorage.getItem("switch_to_tab"));

        chrome.tabs.getSelected(null, function(tab){
          if (id != tab.id) {
            chrome.tabs.remove(tab.id);
          }
        });
        chrome.tabs.update(id, {active: true});
        localStorage.setItem("switch_to_tab", -1);
      }
    }

    if ( e.originalEvent.key === "close_tab" ) {
      var id = parseInt(localStorage.getItem("close_tab"));
      if (localStorage.getItem("close_tab") !== "-1") {
          chrome.tabs.remove(id);
          localStorage.setItem("close_tab", "-1");
      }
    }

    if ( e.originalEvent.key === "pin_toggle" ) {
      var id  = parseInt(localStorage.getItem("pin_toggle"));
      if ( typeof(id) === "null" ) {
        return false;
      }

      var tab = tabs.filter(function (tab) { return tab.id === id; })[0];
      if ( typeof(tab) === "undefined" ) {
        console.error("Tab wasn't found");
        return false;
      }

      // Invert pin state
      chrome.tabs.update(id, { pinned: !tab.pinned });

      localStorage.setItem("pin_toggle", "null");
    }
  });

  /* END :: Tab Manager Widget */

/* END :: Recently Closed Tabs */

/* START :: Get Installed Widgets */
var extensions,
    event_lock = false;
chrome.management.getAll(reloadExtensions);
function reloadExtensions(data) {
  extensions = data;
  reloadInstalledWidgets();
  event_lock = false;
}

$(window).bind('storage', function (e) {
  // When Refresh button in the widgets window is pressed
  if ( typeof(e.originalEvent) === "object"
    && typeof(e.originalEvent.key) === "string"
    && e.originalEvent.key === "refresh_widgets" )
      chrome.management.getAll(reloadExtensions);

  // When Awesome New Tab Page is reset
  if ( typeof(e.originalEvent) === "object"
    && typeof(e.originalEvent.key) === "string"
    && e.originalEvent.key === "" )
      chrome.management.getAll(reloadExtensions);
});

function reloadInstalledWidgets() {

  localStorage.setItem("installed_widgets", JSON.stringify( [] ));

  sayHelloToPotentialWidgets();

  setTimeout(function() {
    window.location = window.location;
  }, 10000);
}

chrome.management.onEnabled.addListener( onInstalled );
chrome.management.onInstalled.addListener( onInstalled );
function onInstalled(ExtensionInfo) {

  if ( event_lock === true ) {
    return;
  } else {
    event_lock = true;
  }
  chrome.management.getAll(reloadExtensions);

  setTimeout(function() {
    recently_installed = null;
  }, 5000);
}
chrome.management.onDisabled.addListener( onUninstalled );
chrome.management.onUninstalled.addListener( onUninstalled );
function onUninstalled(ExtensionInfo) {

  if ( event_lock === true ) {
    return;
  } else {
    event_lock = true;
  }

  chrome.management.getAll(reloadExtensions);
  // console.log(ExtensionInfo);
}

if ( Math.round(new Date().getTime()/1000.0) > parseInt(localStorage.getItem("last_widget_update")) + 30*60 ) {
  chrome.management.getAll(reloadExtensions);
  localStorage.setItem("last_widget_update", Math.round(new Date().getTime()/1000.0) );
}

if ( localStorage.getItem("installed_widgets") === null ) {
  chrome.management.getAll(reloadExtensions);
}

if ( localStorage.getItem("installed_widgets") === "[]" ) {
  if ( Math.round(new Date().getTime()/1000.0) > parseInt(localStorage.getItem("last_widget_update")) + 5*60 ) {
    chrome.management.getAll(reloadExtensions);
    localStorage.setItem("last_widget_update", Math.round(new Date().getTime()/1000.0) );
  }
}

/* END :: Get Installed Widgets */

/* START :: External Communication Stuff */

// Attempts to establish a connection to all installed widgets
function sayHelloToPotentialWidgets() {
  for (var i in extensions) {
    chrome.extension.sendRequest(
      extensions[i].id,
      "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-poke"
    );
  }
};

// Listens for responses
chrome.extension.onRequestExternal.addListener( onRequestExternal );
function onRequestExternal(request, sender, sendResponse) {
  if(request.head) {
    if(request.head === "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-pokeback") {

      var installed_widgets_temp = JSON.parse(localStorage.getItem("installed_widgets"));

      installed_widgets_temp.push({
        "request": request,
        "sender": sender,
      });

      localStorage.setItem("installed_widgets", JSON.stringify( installed_widgets_temp ));
    }
  }
}

/* END :: External Communication Stuff */
