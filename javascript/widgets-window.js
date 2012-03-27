/*
 *
 *  Awesome New Tab Page
 *    http://antp.co/
 *    Copyright 2011+ Michael Hart (http://h4r7.me/).
 *
 *  Want to make it even more awesome?
 *    https://github.com/michaelhart/Awesome-New-Tab-Page/
 *
 *  Widgets Window
 *    JavaScript essential to the widgets window.
 *
 *  Licensed under GPL v3:
 *    http://www.gnu.org/licenses/gpl-3.0.txt
 *
 */
$(document).ready(function($) {
  setTimeout(function() {
    setupStockWidgets();
  }, 1100);

  setTimeout(function() {
    setupInstalledWidgets();
  }, 900);
});

// Only handles 1 at a time; widget
function setupDrawerWidgets(_widget) {
    if (!_widget.request || !_widget.sender) {
      return false;
    }
    if (!_widget.request.body) {
      return false;
    }
    if (_widget.request.body.poke === 1) {
      widgets[_widget.sender.id] = _widget.body;

      if( parseInt(_widget.request.body.height) > 3 || parseInt(_widget.request.body.width) > 3 ) {
        return false;
      }

      var widget_name = null;
      if (_widget.sender.name) {
        widget_name = _widget.sender.name;
      } else {
        widget_name = extensions.filter(function (ext) { return ext.id === _widget.sender.id})[0].name;
      }

      var widget_img = null;
      if (_widget.sender.id === "mgmiemnjjchgkmgbeljfocdjjnpjnmcg") {
        widget_img = "icon128.png";
      } else {
        widget_img = 'chrome://extension-icon/' + _widget.sender.id + '/128/0"';
      }

      $(stitch(
        /*  Type: str [app, widget, app-drawer, widget-drawer]*/  "widget-drawer",
        /*  Destination: str [home, app-drawer, widget-drawer]*/  "widget-drawer",
        /*  Ext. ID: str [mgmiemnjjchgkmgbeljfocdjjnpjnmcg]   */  _widget.sender.id,
        /*  Ext. Name: str [Awesome New Tab Page]             */  widget_name,
        /*  URL: str, can be iframe or app url                */  (_widget.request.body.path).replace(/\s+/g, ''),
        /*  Img: str, full path or [id]                       */  ( "id" ),
        /*  Height: int [1, 2, 3]                             */  parseInt(_widget.request.body.height),
        /*  Width: int [1, 2, 3]                              */  parseInt(_widget.request.body.width),
        /*  Top: int                                          */  null,
        /*  Left: int                                         */  null,
        /*  Poke: int                                         */  parseInt(_widget.request.body.poke)
      )).appendTo("#widget-drawer");

      return;
    }
}

$(".ui-2.widgets-refresh").live("click", function() {
  $(".ui-2#widgets .widget").remove();

  localStorage.setItem("refresh_widgets", Math.round(new Date().getTime()/1000.0) );

  setTimeout(function() {
    setupStockWidgets();
  }, 1100);

  setTimeout(function() {
    setupInstalledWidgets();
  }, 900);
});


function setupInstalledWidgets() {
  installed_widgets = JSON.parse(localStorage.getItem("installed_widgets"));

  $.each(installed_widgets, function(id, widget) {
    setupDrawerWidgets(widget);
  });
}

function setupStockWidgets() {
  $.each(stock_widgets, function(id, widget) {
    if(widget.isApp === false && widget.type !== "shortcut" && widget.type !== "app") {
      setupDrawerWidgets({
        request: {
          body: {
            height: widget.size[0],
            width: widget.size[1],
            path: widget.path,
            poke: 1,
          },
          head: "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-pokeback"
        },
        sender: {
          id: "mgmiemnjjchgkmgbeljfocdjjnpjnmcg",
          name: widget.name,
          stock: id,
          tab: null,
        }
      });
    }
  });
}