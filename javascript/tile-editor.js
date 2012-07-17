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


$("#delete").live("click", function(){
  var to_delete = $(this).parent().parent();
  if(to_delete) {
    var id = $(to_delete).attr("id");
    if ( widgets[id]
      && widgets[id].type === "shortcut"
      && (widgets[id].img).match("filesystem:") ) {

      deleteShortcut( (widgets[id].img).match(/^(.*)\/(.*)/)[2] );

    }

    $(".ui-2.x").trigger("click");
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
    $(this).attr("land-top"),
    $(this).attr("land-left")
  );

  $(stitch(
    /*  Type: str [app, widget, app-drawer, widget-drawer]*/  "shortcut",
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
$("#delete,#shortcut-edit,#widget-config").live("mousedown mouseup move", function(e) {
  e.stopPropagation();
  e.preventDefault();
});

// Edit shortcut or app
$("#shortcut-edit").live("click", function(e){
  $("body > .ui-2").hide();

  var shortcut_parent = $(this).parent().parent()[0];
  if(!shortcut_parent) { console.warn("!shortcut_parent", this, shortcut_parent); return; }

  widgets = JSON.parse(localStorage.getItem("widgets"));

  var id = $(shortcut_parent)[0].id;
  if(!widgets[id]) { console.warn("!widgets["+id+"]", shortcut_parent, widgets); return; }

  var this_extension = extensions.filter(function (ext) { return ext.id === id })[0];
  var is_app = (typeof(this_extension) !== "undefined" && typeof(this_extension.isApp) === "boolean");
  var is_shortcut = (widgets[id].type && widgets[id].type === "shortcut");

  var stock_app = false;
  if ( $.inArray(id, ["webstore", "amazon", "fandango", "facebook", "twitter"]) !== -1 ) {
    widgets[id].img = stock_widgets[id].simg;
    stock_app = true;
  }

  if ( is_shortcut ) {
    if ( widgets[id].favicon_show !== false ) {
      $(".ui-2#editor #shortcut_favicon_show").prop("checked", true);
      $(".ui-2#editor #preview-tile .app-favicon").show()
        .attr("src", "chrome://favicon/"+ (widgets[id].url || widgets[id].appLaunchUrl) );
    } else {
      $(".ui-2#editor #shortcut_favicon_show").prop("checked", false);
      $(".ui-2#editor #preview-tile .app-favicon").hide()
        .attr("src", "chrome://favicon/"+ (widgets[id].url || widgets[id].appLaunchUrl) );
    }
  } else {
    $(".ui-2#editor #preview-tile .app-favicon").hide();
  }

  var editor_type;
  if ( is_shortcut ) {
    editor_type = "shortcut";
    $(".hide-if-app").show();
    $(".show-if-app").hide();
  } else {
    editor_type = "app";
    $(".hide-if-app").hide();
    $(".show-if-app").show();
  }

  $("#swatches").html("").hide();
  if ( is_app === true && stock_app === false ) {
    var image = widgets[id].img;
    var medianPalette = createPalette(
      $("<img />").attr({
        "src": image,
        "id" : "temporary-element-to-delete"
      }).css({
        "display": "none"
      }).appendTo("body")
    , 5);
    $.each(medianPalette, function(index, value) {
      var swatchEl = $('<div>')
      .css("background-color","rgba(" +value[0]+ "," +value[1]+  "," +value[2]+ ", 1)")
      .data({
        "r": value[0],
        "g": value[1],
        "b": value[2]
      }).addClass("swatch");
      $("#swatches").append(swatchEl).show();
    });

    $("#temporary-element-to-delete").remove();
  }

   $(".swatch").live("click", function () {
     var id = $(".ui-2#editor").attr("active-edit-id");
     var r = $(this).data("r");
     var g = $(this).data("g");
     var b = $(this).data("b");
     $(".ui-2#editor #shortcut_colorpicker").ColorPickerSetColor( ({ r: r, g: g, b: b }) );
     $("#" + id).css('backgroundColor', "rgba("+r+"," +g+ "," +b+ ", 1)" );
     $(".ui-2#editor .fake-tile#preview-tile").css('backgroundColor', "rgba(" +r+ "," +g+ "," +b+ ", 1)" );
     widgets[id].color = "rgba(" +r+ "," +g+ "," +b+ ", 1)";
     localStorageSync(false);
     updateShortcut();
   });

  $(".ui-2#editor")
    .show()
    .attr("active-edit-id", id)
    .attr("active-edit-type", editor_type);

  var previewTile = $(".ui-2#editor #preview-tile");
  if(widgets[id].shortcut_background_transparent && widgets[id].shortcut_background_transparent === true) {
    $(".ui-2#editor #shortcut_background_transparent").prop("checked", true);
    previewTile
      .css("background-image", "url("+widgets[id].img+")")
      .css("background-color", "transparent");
  } else {
    $(".ui-2#editor #shortcut_background_transparent").prop("checked", false);
    previewTile
      .css("background-image", "url("+widgets[id].img+")" + gradient)
      .css("background-color", widgets[id].color);
  }
  // set previewTile's background position
  $(".ui-2#editor #invisible-tile-img").attr("src", widgets[id].img);
  if (widgets[id].backgroundPosition) {
    previewTile.css("background-position", widgets[id].backgroundPosition);
  }
  if (widgets[id].backgroundSize) {
    previewTile.css("background-size", widgets[id].backgroundSize);
    IconResizing.previewTileUpdated(IconResizing.updateSlider);
  }
  IconResizing.previewTileUpdated();

  $(".ui-2#editor #editor-name, .ui-2#editor #preview-tile .app-name").html( widgets[id].name );
  $(".ui-2#editor #shortcut_name").val( widgets[id].name );

  if( typeof( widgets[id] ) !== "undefined" && widgets[id].name_show && widgets[id].name_show === false) {
    $(".ui-2#editor #shortcut_name_show").prop("checked", false);
    $(".ui-2#editor .app-name").css("opacity", 0);
  } else {
    $(".ui-2#editor #shortcut_name_show").prop("checked", true);
    $(".ui-2#editor .app-name").css("opacity", 1);
  }

  if( typeof( widgets[id] ) !== "undefined" && widgets[id].pin && widgets[id].pin === true) {
    $(".ui-2#editor #shortcut_pin").prop("checked", true);
  } else {
    $(".ui-2#editor #shortcut_pin").prop("checked", false);
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
      $("#"+id).css('backgroundColor', "rgba("+rgb.r+","+rgb.g+","+rgb.b+", 1)" );
      $(".ui-2#editor .fake-tile#preview-tile").css('backgroundColor', "rgba("+rgb.r+","+rgb.g+","+rgb.b+", 1)" );
      widgets[id].color = "rgba("+rgb.r+","+rgb.g+","+rgb.b+",  1)";
      localStorageSync(false);
      updateShortcut();
    }
  });

  $(".ui-2#editor #shortcut_colorpicker").ColorPickerSetColor( ({ r: rgb[1], g: rgb[2], b: rgb[3] }) );
});

// Adds shortcut
function addShortcut(widget, top, left) {
  widgets = JSON.parse(localStorage.getItem("widgets"));

  widgets[widget] = {
    where: [top,left],
    size: [1,1],
    type: "shortcut",
    isApp: false,
    name: "Google",
    id: widget,
    img: "core.shortcut.blank2.png",
    appLaunchUrl: "http://www.google.com/",
    url: "http://www.google.com/"
  };

  localStorageSync(false);
}

// Update tile, localStorage, and previews for Tile Editor changes
$(".ui-2#editor input").not("#zoom-slider").bind("keyup change", updateShortcut);

function updateShortcut(e) {
  try {
    widgets  = JSON.parse(localStorage.getItem("widgets"));
    var id   = $(".ui-2#editor").attr("active-edit-id");
    var type = $(".ui-2#editor").attr("active-edit-type")
    var name = $(".ui-2#editor #shortcut_name").val();
    var pin  = $(".ui-2#editor #shortcut_pin").is(':checked')
    var url  = $(".ui-2#editor #shortcut_url").val();
    var img  = $(".ui-2#editor #img_url").val();
    var name_show  = $(".ui-2#editor #shortcut_name_show").is(':checked');
    var favicon_show  = $(".ui-2#editor #shortcut_favicon_show").is(':checked');
    var shortcut_background_transparent  = $(".ui-2#editor #shortcut_background_transparent").is(':checked');
    var is_shortcut = (widgets[id].type && widgets[id].type === "shortcut");


    if ( $.inArray(id, ["webstore", "amazon", "fandango", "facebook", "twitter"]) !== -1 ) {
      widgets[id].img = stock_widgets[id].simg;
    }

    widgets[id].name_show = name_show;
    if ( name_show === false ) {
      $(".ui-2#editor #shortcut_name_show").prop("checked", false);
      $(".ui-2#editor .app-name, #widget-holder #"+id+" .app-name").css("opacity", 0);
    } else {
      $(".ui-2#editor #shortcut_name_show").prop("checked", true);
      $(".ui-2#editor .app-name, #widget-holder #"+id+" .app-name").css("opacity", 1);
    }

    widgets[id].pin = pin;
    if ( pin === true ) {
      $(".ui-2#editor #shortcut_pin").prop("checked", true);
      $("#widget-holder #"+id+" .url").attr("pin", "pin");
    } else {
      $(".ui-2#editor #shortcut_pin").prop("checked", false);
      $("#widget-holder #"+id+" .url").attr("pin", null);
    }

    if ( type === "app" ) {
      favicon_show = false;
    }
    widgets[id].favicon_show = favicon_show;
    if ( favicon_show !== false ) {
      $(".ui-2#editor #preview-tile .app-favicon, #"+id+" .app-favicon").show()
        .attr("src", "chrome://favicon/"+ url);
      $("#" + id )
    } else {
      $(".ui-2#editor #preview-tile .app-favicon, #"+id+" .app-favicon").hide()
        .attr("src", "chrome://favicon/"+ url);
    }

    widgets[id].shortcut_background_transparent = shortcut_background_transparent;
    if(type === "shortcut") {
      widgets[id].img = img;

      $("#" + id + " a").attr("data-url", url);
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

    // update the invisible image (inivisible image is used to calculate image width and height)
    $(".ui-2#editor #invisible-tile-img").attr("src", widgets[id].img);
    IconResizing.previewTileUpdated();

    $("#" + id + " .app-name, .ui-2#editor #editor-name, .ui-2#editor #preview-tile .app-name").html(name);
    widgets[id].name = name;

    localStorageSync(false);
  }
  catch (err) {
    _e(7);
  }
}


IconResizing = {
  id: null,
  previewTile: null, 
  tileImg: null,
  tileWidth: null,
  tileHeight: null,
  imgWidth: null,
  imgHeight: null,
  sizeRatio: null, 

  init: function() {
    // when reset button clicked
    $("#icon-resize-scale-controls #reset-bt").click(IconResizing.resetTileIcon);
    // when center button clicked
    $("#icon-resize-scale-controls #center-bt").click(IconResizing.centerTileIcon);
      // when cover button clicked
    $("#icon-resize-scale-controls #cover-bt").click(function () { IconResizing.changeBackgroundSize("cover"); });
    // when contain button clicked
    $("#icon-resize-scale-controls #contain-bt").click(function () { IconResizing.changeBackgroundSize("contain"); });
    // on zoom
    $("#icon-resize-scale-controls #zoom-slider").change(IconResizing.changeZoomLevel);
  }, 

  calculateVars: function (callback) {
    var previousId = IconResizing.id;
    IconResizing.id = $(".ui-2#editor").attr("active-edit-id");
    IconResizing.previewTile = $(".ui-2#editor #preview-tile, #widget-holder #" + IconResizing.id), 
    IconResizing.tileImg = $("#invisible-tile-img");
    IconResizing.tileWidth = IconResizing.previewTile.filter(":eq(0)").width();
    IconResizing.tileHeight = IconResizing.previewTile.filter(":eq(0)").height();

    // keep on getting image width, height until get correct one
    var handler = setInterval(function() {
      var newImgWidth = IconResizing.tileImg.width();
      var newImgHeight = IconResizing.tileImg.height();
      if (newImgWidth != 0) {
        // if image is changed then reset its position and zoom level
        if (IconResizing.id == previousId && (IconResizing.imgWidth != newImgWidth || IconResizing.imgHeight != newImgHeight)) {
          IconResizing.imgWidth = newImgWidth;
          IconResizing.imgHeight = newImgHeight;
          IconResizing.sizeRatio = IconResizing.imgWidth / IconResizing.imgHeight;
          IconResizing.resetTileIcon();
        }
        else {
          IconResizing.imgWidth = newImgWidth;
          IconResizing.imgHeight = newImgHeight;
          IconResizing.sizeRatio = IconResizing.imgWidth / IconResizing.imgHeight;
        }
        clearInterval(handler);
        if (callback) {
          callback();
        }
      }
    }, 50);
  }, 

  previewTileUpdated: function(callback) {
    IconResizing.calculateVars(callback);
  }, 

  // reset tile's background position to center and scale to 1
  resetTileIcon: function() {
    IconResizing.previewTile.css("background-position", "center center").css("background-size", "auto");
    var slider = $("#icon-resize-scale-controls #zoom-slider");
    if (IconResizing.imgWidth >= IconResizing.tileWidth) {
      slider.val(slider.attr("max"));
    }
    else {
      slider.val(slider.attr("min"));
    }
    IconResizing.savePosition();
  }, 

  // change tile's background position to center
  centerTileIcon: function() {
    IconResizing.previewTile.css("background-position", "center center");
    IconResizing.savePosition();
  }, 


  // change tile's background position to cover
  changeBackgroundSize: function(changeTo){
    var imgWidth;
    var imgHeight;
    if (changeTo == "cover"){
      if (IconResizing.sizeRatio >= 1) {
        imgHeight = IconResizing.tileHeight;
        imgWidth = imgHeight * IconResizing.sizeRatio;
      }
      else {
        imgWidth = IconResizing.tileWidth;
        imgHeight = imgWidth / IconResizing.sizeRatio;
      }
    }
    else if (changeTo == "contain"){
      if (IconResizing.sizeRatio >= 1){
        imgWidth = IconResizing.tileWidth;
        imgHeight = imgWidth / IconResizing.sizeRatio;
      }
      else {
        imgHeight = IconResizing.tileHeight;
        imgWidth = imgHeight * IconResizing.sizeRatio; 
      }
    }

    IconResizing.previewTile.css("background-size", imgWidth + "px " + imgHeight + "px, 100% 100%");

    IconResizing.updateSlider();
    IconResizing.savePosition();
  }, 

  // recalculates zoom slider position
  updateSlider: function() {
    var slider = $("#icon-resize-scale-controls #zoom-slider");
    var backgroundWidth = IconResizing.previewTile.filter(":eq(0)").css("background-size").split(" ")[0];
    if (backgroundWidth == "auto,") {
      if (IconResizing.imgWidth > IconResizing.tileWidth) {
        slider.val(slider.attr("max"));
      }
      else {
        slider.val(slider.attr("min"));
      }

    }
    else {
      var currentImgWidth = extractNumber(backgroundWidth);
      var zoomPerStep = IconResizing.getZoomPerStep(slider.attr("max"));
      var step;
      if (IconResizing.imgWidth >= IconResizing.tileWidth) {
        step = (currentImgWidth - IconResizing.tileWidth) / zoomPerStep;
      }
      else {
        step = (currentImgWidth - IconResizing.imgWidth) / zoomPerStep;
      }
      slider.val(step);
    }
  }, 

  changeZoomLevel: function() {
    var step = this.value;
    var zoomPerStep = IconResizing.getZoomPerStep(this.max);
    var imgWidth;
    if (IconResizing.imgWidth < IconResizing.tileWidth) {
      imgWidth = IconResizing.imgWidth + (step * zoomPerStep);
    }
    else {
      imgWidth = IconResizing.tileWidth + (step * zoomPerStep);
    }
    var imgHeight = imgWidth / IconResizing.sizeRatio;
    IconResizing.previewTile.css("background-size", imgWidth + "px " + imgHeight + "px, 100% 100%");
    IconResizing.savePosition();
  }, 

  getZoomPerStep: function(maxStep) {
    var zoomPerStep = (IconResizing.imgWidth - IconResizing.tileWidth) / maxStep;
    if (zoomPerStep < 0) {
      zoomPerStep = (IconResizing.tileWidth - IconResizing.imgWidth) / maxStep;
    }
    return zoomPerStep;
  }, 

  // save tile's position and scale to localstorage
  savePosition: function() {
    widgets = JSON.parse(localStorage.getItem("widgets"));
    widgets[IconResizing.id].backgroundPosition = IconResizing.previewTile.filter(":eq(0)").css("background-position");
    widgets[IconResizing.id].backgroundSize = IconResizing.previewTile.filter(":eq(0)").css("background-size");
    localStorageSync(false);
  }
}

IconResizing.init();

/**
 * Dragging image in preview tile to adjust its position
*/
IconDragging = {
  mouseStartPos: {}, 
  backgroundPos: {}, 
  tile: null, // save preview tile to avoid repeatedly searching it
  dragging: false, // true if dragging is in progress

  init: function(){
    // to start dragging on mousedown (start dragging only if clicked on preview tile)
    $(document).mousedown(function(event) {
      if (event.button == 0)
      {
        var previewTile = $(event.target).parents("#preview-tile");
        if (previewTile.length > 0) // if user clicked within preview tile then start dragging
        {
          $(event.target).css("cursor", "move");
          IconDragging.startDragging(event, previewTile);
        }
      }
    });

    // stop dragging if dragging is in progress
    $(document).mouseup(function(event) {
      if (IconDragging.dragging){
        IconDragging.stopDragging();
      }
    });
  }, 

  startDragging: function(event, previewTile) {
    previewTile.css("cursor", "move");
    IconDragging.mouseStartPos.X = event.clientX;
    IconDragging.mouseStartPos.Y = event.clientY;
    IconDragging.backgroundPos = getBackgroundPos(previewTile);
    IconDragging.tile = IconResizing.previewTile;
    IconDragging.dragging = true;

    $(document).mousemove(IconDragging.dragTile);  // start moving the tile on mousemove
  }, 

  dragTile: function(event) {
    var newBackgroundPos = {};
    newBackgroundPos.X = (IconDragging.backgroundPos.X + event.clientX - IconDragging.mouseStartPos.X) + "px";
    newBackgroundPos.Y = (IconDragging.backgroundPos.Y + event.clientY - IconDragging.mouseStartPos.Y) + "px";
    IconDragging.tile.css("background-position", newBackgroundPos.X + " " + newBackgroundPos.Y + ", 100% 100%");
  }, 

  stopDragging: function(event) {
    dragging = false;
    $(document).unbind("mousemove");
    IconResizing.savePosition();
  }
}

IconDragging.init();  // binds events for dragging

function getBackgroundPos(element) {
  var position = {}, 
    arr;
  var backgroundPos = element.css("background-position");
  // if background position is in percent then calculate background position manually
  if (backgroundPos == "50% 50%, 50% 50%") {
    var size = element.css("background-size").split(" ");
    if (size[1] == "auto") {
      size[0] = IconResizing.imgWidth;
      size[1] = IconResizing.imgHeight;
    }
    position.X = ((extractNumber(size[0]) / 2) - (IconResizing.tileWidth / 2)) * -1;
    position.Y = ((extractNumber(size[1]) / 2) - (IconResizing.tileHeight / 2)) * -1;
  }
  else {
    arr = backgroundPos.split(" ");
    position.X = extractNumber(arr[0]);
    position.Y = extractNumber(arr[1]);
  }

  return position;
}

function extractNumber(value) {
    var n = parseInt(value); 
    return n == null || isNaN(n) ? 0 : n;
}
