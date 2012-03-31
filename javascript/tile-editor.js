/*
 *
 *  Awesome New Tab Page
 *    http://antp.co/
 *    Copyright 2011+ Michael Hart (http://h4r7.me/).
 *
 *  Want to make it even more awesome?
 *    https://github.com/michaelhart/Awesome-New-Tab-Page/
 *
 *  Tile Editor
 *    JavaScript essential for the tile editor & custom shortcuts
 *
 *  Licensed under GPL v3:
 *    http://www.gnu.org/licenses/gpl-3.0.txt
 *
 */

$("#delete").live("click", function(){
  var to_delete = null;
  to_delete = $(this).parent().parent();
  if(to_delete) {
    removeWidget( $(to_delete).attr("id") );

    hscroll = true;

    var tiles = getCovered(to_delete);
    $(tiles.tiles).each(function(ind, elem){
        $(elem).addClass("empty");
    });

    $(to_delete).remove();
  }
});

// Create shortcut on click
$(".unlocked .empty.add-shortcut").live("click", function() {
  var new_shortcut_id = new_guid();

  addShortcut(
    new_shortcut_id,
    $(this).attr("data-land-top"),
    $(this).attr("data-land-left")
  );

  $(stitch(
    /*  Type: str [app, widget, app-drawer, widget-drawer]*/  "shortcut",
    /*  Destination: str [home, app-drawer, widget-drawer]*/  "home",
    /*  Ext. ID: str [mgmiemnjjchgkmgbeljfocdjjnpjnmcg]   */  new_shortcut_id,
    /*  Ext. Name: str [Awesome New Tab Page]             */  "Google",
    /*  URL: str, can be iframe or app url                */  "http://www.google.com/",
    /*  Img: str, full path or [id]                       */  "core.shortcut.blank2.png",
    /*  Height: int [1, 2, 3]                             */  1,
    /*  Width: int [1, 2, 3]                              */  1,
    /*  Top: int                                          */  $(this).attr("data-land-top"),
    /*  Left: int                                         */  $(this).attr("data-land-left"),
    /*  Poke: int                                         */  null
  )).appendTo("#widget-holder");

  $("#" + new_shortcut_id).css({
    "left": $(this).position().left,
    "top": $(this).position().top,
    "width": "200",
    "height": "200",
    "zIndex": "1"
  }).find(".iframe-mask").removeClass("hidden").find("#shortcut-edit").trigger("click");

  $(this).removeClass("add-shortcut").removeClass("empty");
});

// Stop edit or delete buttons from interacting with the shortcut/app
$("#delete,#shortcut-edit").live("mousedown mouseup move", function(e) {
  e.stopPropagation();
  e.preventDefault();
});

// Edit shortcut or app
$("#shortcut-edit").live("click", function(e){
  var shortcut_parent = $(this).parent().parent()[0];
  if(!shortcut_parent) { console.warn("!shortcut_parent", this, shortcut_parent); return; }

  widgets = JSON.parse(localStorage.getItem("widgets"));
  var id = $(shortcut_parent)[0].id;
  if(!widgets[id]) { console.warn("!widgets["+id+"]", shortcut_parent, widgets); return; }

  if(widgets[id].type && widgets[id].type === "shortcut") {
    shortcut_type = "shortcut";
    $(".hide-if-app").show();
  } else {
    shortcut_type = "app";
    $(".hide-if-app").hide();
  }

  if ( $.inArray(id, ["webstore", "amazon", "fandango", "facebook", "twitter"]) !== -1 ) {
    widgets[id].img = stock_widgets[id].simg;
  }

  $(".ui-2#editor")
    .fadeIn()
    .attr("active-edit-id", id)
    .attr("active-edit-type", shortcut_type);

  if(widgets[id].shortcut_background_transparent && widgets[id].shortcut_background_transparent === true) {
    $(".ui-2#editor #shortcut_background_transparent").prop("checked", true);
    $(".ui-2#editor #preview-tile")
      .css("background-image", "url("+widgets[id].img+")")
      .css("background-color", "transparent");
  } else {
    $(".ui-2#editor #shortcut_background_transparent").prop("checked", false);
    $(".ui-2#editor #preview-tile")
      .css("background-image", "url("+widgets[id].img+")" + gradient)
      .css("background-color", widgets[id].color);
  }

  $(".ui-2#editor #editor-name, .ui-2#editor #preview-tile .app-name").html( widgets[id].name );
  $(".ui-2#editor #shortcut_name").val( widgets[id].name );

  if(typeof( widgets[id] ) != "undefined" && widgets[id].name_show === false) {
    $(".ui-2#editor #shortcut_name_show").prop("checked", false);
    $(".ui-2#editor .app-name").css("opacity", 0);
  } else {
    $(".ui-2#editor #shortcut_name_show").prop("checked", true);
    $(".ui-2#editor .app-name").css("opacity", 1);
  }

  $(".ui-2#editor #img_url").val( widgets[id].img );

  $(".ui-2#editor #shortcut_url").val( widgets[id].url || widgets[id].appLaunchUrl );

  var rgb = [];
  rgb = (widgets[$(".ui-2#editor").attr("active-edit-id")].color).match(/(rgba?)|(\d+(\.\d+)?%?)|(\.\d+)/g);

  $(".ui-2#editor #shortcut_colorpicker").ColorPicker({
    color: ( ({ r: rgb[1], g: rgb[2], b: rgb[3] }) || "#309492") ,
    onShow: function (colpkr) {
      widgets  = JSON.parse(localStorage.getItem("widgets"));
      $(colpkr).fadeIn(500);
      return false;
    },
    onHide: function (colpkr) {
      $(colpkr).fadeOut(500);
      return false;
    },
    onChange: function (hsb, hex, rgb) {
      widgets  = JSON.parse(localStorage.getItem("widgets"));
      var id = $(".ui-2#editor").attr("active-edit-id");
      $("#"+id).css('backgroundColor', "rgba("+rgb.r+","+rgb.g+","+rgb.b+",.7)" );
      $(".ui-2#editor .fake-tile#preview-tile").css('backgroundColor', "rgba("+rgb.r+","+rgb.g+","+rgb.b+",.7)" );
      widgets[id].color = "rgba("+rgb.r+","+rgb.g+","+rgb.b+", .7)";
      localStorageSync(false);
      updateShortcut();
    }
  });

  $(".ui-2#editor #shortcut_colorpicker").ColorPickerSetColor( ({ r: rgb[1], g: rgb[2], b: rgb[3] }) );
});

// Update tile, localStorage, and previews for Tile Editor changes
$(".ui-2#editor input").live('keyup change', updateShortcut);

function updateShortcut(e) {
  try {
    widgets  = JSON.parse(localStorage.getItem("widgets"));
    var id   = $(".ui-2#editor").attr("active-edit-id");
    var type = $(".ui-2#editor").attr("active-edit-type")
    var name = $(".ui-2#editor #shortcut_name").val();
    var url  = $(".ui-2#editor #shortcut_url").val();
    var img  = $(".ui-2#editor #img_url").val();
    var name_show  = $(".ui-2#editor #shortcut_name_show").is(':checked');
    var shortcut_background_transparent  = $(".ui-2#editor #shortcut_background_transparent").is(':checked');

    if ( $.inArray(id, ["webstore", "amazon", "fandango", "facebook", "twitter"]) !== -1 ) {
      widgets[id].img = stock_widgets[id].simg;
    }

    widgets[id].name_show = name_show;
    if(name_show === false) {
      $(".ui-2#editor #shortcut_name_show").prop("checked", false);
      $(".ui-2#editor .app-name, #widget-holder #"+id+" .app-name").css("opacity", 0);
    } else {
      $(".ui-2#editor #shortcut_name_show").prop("checked", true);
      $(".ui-2#editor .app-name, #widget-holder #"+id+" .app-name").css("opacity", 1);
    }

    widgets[id].shortcut_background_transparent = shortcut_background_transparent;

    if(type === "shortcut") {
      widgets[id].img = img;

      $("#" + id + " a").attr("href", url);
      widgets[id].appLaunchUrl = url;
      widgets[id].url = url;
    }

    if(widgets[id].shortcut_background_transparent && widgets[id].shortcut_background_transparent === true) {
      $(".ui-2#editor #preview-tile, #widget-holder #"+id)
        .css("background-image", "url("+widgets[id].img+")")
        .css("background-color", "transparent");
    } else {
      $(".ui-2#editor #preview-tile, #widget-holder #"+id)
        .css("background-image", "url("+widgets[id].img+")" + gradient)
        .css("background-color", widgets[id].color);
    }

    $("#" + id + " .app-name, .ui-2#editor #editor-name, .ui-2#editor #preview-tile .app-name").html(name);
    widgets[id].name = name;

    localStorageSync(false);
  }
  catch (err) {
    _e(7);
  }
}