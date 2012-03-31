/*
 *
 *  Awesome New Tab Page
 *    http://antp.co/
 *    Copyright 2011+ Michael Hart (http://h4r7.me/).
 *
 *  Want to make it even more awesome?
 *    https://github.com/michaelhart/Awesome-New-Tab-Page/
 *
 *  Apps Window
 *    JavaScript essential to the apps window.
 *
 *  Licensed under GPL v3:
 *    http://www.gnu.org/licenses/gpl-3.0.txt
 *
 */

var extensions;
// Get all installed extensions and apps
chrome.management.getAll( function(data) {
  extensions = data;
  // Setup the Apps window
  setTimeout(setupDrawerApps, 1000);
});

function setupDrawerApps() {
  if($.isArray( extensions )) {

    var _extensions = extensions;

    _extensions.push(
      stock_widgets.webstore,
      stock_widgets.fandango,
      stock_widgets.amazon,
      stock_widgets.facebook,
      stock_widgets.twitter
    );

    $.each(_extensions, function(index, value) {
      if(value.isApp === true && value.enabled === true) {
        if(value.stock === true) {
          var app_img_url = value.img;
        } else {
          var app_img_url = "chrome://extension-icon/" + value.id + "/128/0";
        }

        $(stitch(
          /*  Type: str [app, widget, app-drawer, widget-drawer]*/  "app-drawer",
          /*  Destination: str [home, app-drawer, widget-drawer]*/  "app-drawer",
          /*  Ext. ID: str [mgmiemnjjchgkmgbeljfocdjjnpjnmcg]   */  value.id,
          /*  Ext. Name: str [Awesome New Tab Page]             */  value.name,
          /*  URL: str, can be iframe or app url                */  value.appLaunchUrl,
          /*  Img: str, full path or [id]                       */  ( app_img_url ),
          /*  Height: int [1, 2, 3]                             */  1,
          /*  Width: int [1, 2, 3]                              */  1,
          /*  Top: int                                          */  null,
          /*  Left: int                                         */  null,
          /*  Poke: int                                         */  null
        )).appendTo(".ui-2#apps > .contents");
      }
    });

    _extensions = null;
  }
}

$(".ui-2 .drawer-app-uninstall").live("click", function(e){
  var to_delete = null;
  var to_delete_name = null;
  to_delete = $(this).parent();
  to_delete_name = $(to_delete).find(".drawer-app-name").html();

  var r=confirm("Are you sure you want to uninstall " + to_delete_name + "?");
  if (r==true) {
    chrome.management.uninstall($(to_delete).attr("id"), reload() );
  }

  return false;
});