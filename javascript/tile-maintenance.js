/*
 *
 *  Awesome New Tab Page
 *    http://antp.co/
 *    Copyright 2011+ Michael Hart (http://h4r7.me/).
 *
 *  Want to make it even more awesome?
 *    https://github.com/michaelhart/Awesome-New-Tab-Page/
 *
 *  Tile Maintenance
 *    JavaScript essential for "stitching" together, creating, updating,
 *    and removing various tile types.
 *
 *  Licensed under GPL v3:
 *    http://www.gnu.org/licenses/gpl-3.0.txt
 *
 */

var gradient = ", -webkit-gradient( linear, right bottom, left top, color-stop(1, rgba(255, 255, 255, .04)), color-stop(0, rgba(255, 255, 255, 0.35)) )";
var amazon_regex = new RegExp("amazon\.(com|cn|co\.uk|at|fr|de|it|co\.jp|es)[/]{0,1}[\?]{0,1}");

function stitch(type, destination, id, name, url, img, height, width, top, left, poke) {
  widgets = JSON.parse(localStorage.getItem("widgets"));

  var stitch = "";

  if(!type || !destination || !height || !width) {
    return false;
  }

  if(!url) {
    if( typeof(stock_widgets[id]) !== "undefined" ) {
      url = stock_widgets[id].appLaunchUrl;
    } else {
      console.warn( [false, "Not stock & no URL"] );
    }
  }

  if(type === "app" || type === "shortcut") {
    if(widgets[id].color) {
      background_color = widgets[id].color;
    } else {
      new_background_color = palette[Math.floor(Math.random() * palette.length)];
      background_color = new_background_color;
      widgets[id].color = new_background_color;
      localStorageSync(false);
    }

    if(widgets[id].name_show === false) {
      name_show = "opacity-0";
    } else {
      name_show = "";
    }

    if(widgets[id].shortcut_background_transparent && widgets[id].shortcut_background_transparent === true) {
      background_color = "transparent";
      use_gradient = "";
    } else {
      use_gradient = gradient;
    }

    if(type === "app"
      && typeof(stock_widgets[id]) !== "undefined"
      && typeof(stock_widgets[id].img) !== "undefined" ) {
      img = stock_widgets[id].img;
    }
  }

  if(height > 3 || width > 3) return [false, "Too big"];

  if(img === "id") {
    img = "chrome://extension-icon/" + id + "/128/0";
  }

  if(type === "app") {
    stitch += '<div class="widget app" style="position:absolute; background-image: url('+encodeURI(img)+')'+use_gradient+'; ';
    stitch += 'background-color: ' + background_color + ';" ';
  } else if (type === "iframe") {
    stitch += '<div class="widget" style="position:absolute;" ';
  } else if (type === "shortcut") {
    stitch += '<div class="widget app shortcut" style="position:absolute; background-image: url('+encodeURI(img)+')'+use_gradient+'; ';
    stitch += 'background-color: ' + background_color + ';"';
  } else if (type === "widget-drawer") {
    stitch += '<div class="widget app drawer-app ui-2 ilb" ';
    stitch += 'data-app-source="from-drawer" data-widget="true" data-stock="'+id+'" ';
    stitch += 'data-poke="' + poke + '" ';
    stitch += 'data-widget-src="' + url + '" ';
    stitch += 'data-tile-height="' + height + '" ';
    stitch += 'data-tile-width="' + width + '" ';
  } else if (type === "app-drawer") {
    stitch += '<div class="widget app drawer-app ui-2 ilb"';
    stitch += 'id="' + id + '" data-app-source="from-drawer" ';
    stitch += 'data-tile-height="1" data-tile-width="1" ';
  } else {
    return [false, "Unknown type"];
  }

  stitch += 'id="' + id + '" ';
  stitch += 'data-tile-height="' + height + '" ';
  stitch += 'data-tile-width="' + width + '" ';

  if(destination === "home") {
    stitch += 'inittop="' + top + '" ';
    stitch += 'initleft="' + left + '" ';
  }

  stitch += '>\n';

  if(type === "app") {
    stitch += '<div class="app-name '+name_show+'">' + name + '</div> ';
    stitch += '<a href="' + url + '"><div class="app-mask">&nbsp;</div></a> ';
    stitch += '<div class="iframe-mask hidden"><div id="delete">&nbsp;</div><div id="shortcut-edit">&nbsp;</div></div>\n ';
  } else if (type === "iframe") {
    stitch += '<iframe src="' + url + '" scrolling="no" frameborder="0" ';
    stitch += 'align="center" height="100%" width="100%"></iframe> ';
    stitch += '<div class="iframe-mask hidden"><div id="delete">&nbsp;</div></div>\n ';
  } else if (type === "shortcut") {
    stitch += '<div class="app-name '+name_show+'">' + name + '</div> ';
    stitch += '<a href="' + url + '"><div class="app-mask">&nbsp;</div></a> ';
    stitch += '<div class="iframe-mask hidden"><div id="delete">&nbsp;</div><div id="shortcut-edit">&nbsp;</div></div>\n ';
  } else if (type === "widget-drawer") {
    stitch += '<img class="ui-2 ilb" src="' + img + '"> ';
    stitch += '<div class="ui-2 drawer-app-name ilb">' + name + '</div> ';
    stitch += '<div class="ui-2 drawer-app-wh ilb">'+width+' Wide, '+height+' Tall</div>';
    if(id !== "webstore" && id !== "mgmiemnjjchgkmgbeljfocdjjnpjnmcg") {
      stitch += '<div class="ui-2 drawer-app-uninstall ilb">Remove</div>';
    }
  } else if (type === "app-drawer") {
    if( url && (url).match(amazon_regex) ) {
      if (localStorage["amazon-locale"] !== null
        && localStorage["amazon-locale"] !== ""
        && typeof(localStorage["amazon-locale"]) !== "undefined") {
        this.href = "http://www." + localStorage["amazon-locale"] + "/?tag=sntp-20";
      } else {
        $(this).attr("data-url", "http://www.amazon.com/?tag=sntp-20");
      }
    }

    stitch += '<img class="ui-2 ilb url" src="' + img + '" data-url="' + url + '">';
    stitch += '<div class="ui-2 drawer-app-name ilb url"  data-url="' + url + '">' + name + '</div> ';
    if ( $.inArray(id, ["webstore", "amazon", "fandango", "facebook", "twitter", "mgmiemnjjchgkmgbeljfocdjjnpjnmcg"]) === -1 ) {
      stitch += '<div class="ui-2 drawer-app-uninstall ilb">Remove</div>';
    }
  }

  stitch += '</div>';
  return stitch;
}

// Renders widgets from localStorage
function placeWidgets() {
  if(JSON.parse(localStorage.getItem("widgets")) === null) {
    localStorage.setItem("widgets", JSON.stringify( stock_widgets ));
  }

  widgets = JSON.parse(localStorage.getItem("widgets"));

  $.each(widgets, function(id, widget){
    if(widget.type === "iframe" && widget.size[0] <= 3 && widget.size[1] <= 3) {
      $(stitch(
        /*  Type: str [app, widget, app-drawer, widget-drawer]*/  "iframe",
        /*  Destination: str [home, app-drawer, widget-drawer]*/  "home",
        /*  Ext. ID: str [mgmiemnjjchgkmgbeljfocdjjnpjnmcg]   */  id,
        /*  Ext. Name: str [Awesome New Tab Page]             */  widget.name,
        /*  URL: str, can be iframe or app url                */  widget.path,
        /*  Img: str, full path or [id]                       */  "id",
        /*  Height: int [1, 2, 3]                             */  widget.size[0],
        /*  Width: int [1, 2, 3]                              */  widget.size[1],
        /*  Top: int                                          */  widget.where[0],
        /*  Left: int                                         */  widget.where[1],
        /*  Poke: int                                         */  null
      )).appendTo("#widget-holder");
    }

    if(widget.isApp === true) {
      img = false;
      if( id === ("webstore") ) {
        img = "app.webstore.png";
      }

      $(stitch(
        /*  Type: str [app, widget, app-drawer, widget-drawer]*/  "app",
        /*  Destination: str [home, app-drawer, widget-drawer]*/  "home",
        /*  Ext. ID: str [mgmiemnjjchgkmgbeljfocdjjnpjnmcg]   */  id,
        /*  Ext. Name: str [Awesome New Tab Page]             */  widget.name,
        /*  URL: str, can be iframe or app url                */  widget.url ,
        /*  Img: str, full path or [id]                       */  ( img || "id" ),
        /*  Height: int [1, 2, 3]                             */  widget.size[0],
        /*  Width: int [1, 2, 3]                              */  widget.size[1],
        /*  Top: int                                          */  widget.where[0],
        /*  Left: int                                         */  widget.where[1],
        /*  Poke: int                                         */  null
      )).appendTo("#widget-holder");
    }

    if(widget.type === "shortcut") {

      $(stitch(
        /*  Type: str [app, widget, app-drawer, widget-drawer]*/  "shortcut",
        /*  Destination: str [home, app-drawer, widget-drawer]*/  "home",
        /*  Ext. ID: str [mgmiemnjjchgkmgbeljfocdjjnpjnmcg]   */  id,
        /*  Ext. Name: str [Awesome New Tab Page]             */  widget.name,
        /*  URL: str, can be iframe or app url                */  widget.appLaunchUrl,
        /*  Img: str, full path or [id]                       */  widget.img,
        /*  Height: int [1, 2, 3]                             */  widget.size[0],
        /*  Width: int [1, 2, 3]                              */  widget.size[1],
        /*  Top: int                                          */  widget.where[0],
        /*  Left: int                                         */  widget.where[1],
        /*  Poke: int                                         */  null
      )).appendTo("#widget-holder");
    }

  });

  setStuff();
}

// Adds shortcut to localStorage
function addShortcut(widget, top, left) {
  try {
    widgets = JSON.parse(localStorage.getItem("widgets"));

    widgets[widget] = {
      where: [top,left],
      size: [1,1],
      type: "shortcut",
      isApp: false,
      name: "Google",
      id: widget,
      img: "core.shortcut.blank2.png",
      appLaunchUrl: "http://www.google.com/"
    };

    localStorageSync(false);
  }
  catch (err) {
    _e(6);
  }
}

// Updates shortcut placement
function updateWidget(widget, top, left) {
  try {
    widgets = JSON.parse(localStorage.getItem("widgets"));
    if(!widgets[widget]) return;

    widgets[widget].where = [top, left];

    localStorageSync();
  }
  catch (err) {
    _e(2);
  }
}

// Add widget to localStorage then refresh
function addWidget(is_widget, widget, top, left, src, width, height, poke, stock) {
  try {
    widgets = JSON.parse(localStorage.getItem("widgets"));
    var new_ext_data = null;
    var widget_img = null;
    var appLaunchUrl = null;
    var widget_name = null;
    var widget_src = null;
    if(!height) height = 1;
    if(!width) width = 1;

    if(stock) {
      if(is_widget === false) {
        widget_img = stock.img;
        appLaunchUrl = stock.appLaunchUrl;
      } else {
        widget_src = stock.path;
      }
      widget_name = stock.name;
      widget = stock.id;
    } else {
      new_ext_data = extensions.filter(function (ext) { return ext.id === widget})[0];
      if(is_widget === false) {
        widget_img = "chrome://extension-icon/"+new_ext_data.id+"/128/0";
        appLaunchUrl = new_ext_data.appLaunchUrl;
      } else {
        widget_src = "chrome-extension://"+new_ext_data.id+"/" + src.replace(/\s+/g, '');
      }
      widget_name = new_ext_data.name;
    }

    if(widget === "mgmiemnjjchgkmgbeljfocdjjnpjnmcg") {
      widget = new_guid();
    }

    if(is_widget === false) {
      widgets[widget] = {
        where: [top,left],
        size: [1,1],
        isApp: true,
        name: widget_name,
        id: widget,
        img: widget_img,
        url: appLaunchUrl,
        appLaunchUrl: appLaunchUrl
      };
    }

    if(is_widget === true) {
      widgets[widget] = {
        where: [top,left],
        size: [height,width],
        type: "iframe",
        isApp: false,
        name: widget_name,
        id: widget,
        img: widget_img,
        path: widget_src
      };
    }

    localStorageSync(true);

  }
  catch (err) {
    _e(3);
  }
}

// Delete widget; no refresh
function removeWidget(widget) {
  try {
    delete widgets[widget];

    localStorageSync(false);
  }
  catch (err) {
    _e(4);
  }
}