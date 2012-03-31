/*
 *
 *  Awesome New Tab Page
 *    http://antp.co/
 *    Copyright 2011+ Michael Hart (http://h4r7.me/).
 *
 *  Want to make it even more awesome?
 *    https://github.com/michaelhart/Awesome-New-Tab-Page/
 *
 *  Tile / Widget System
 *    Immense thanks to David Shorten (shortenda at gmail.com)
 *    the original author of the tile system.
 *
 *  Licensed under GPL v3:
 *    http://www.gnu.org/licenses/gpl-3.0.txt
 *
 */

$(document).ready(function($) {
  $("#toggle-grid").live("click", updateGridOpacity);

  if(localStorage.getItem("perm-grid") === null) {
    localStorage.setItem("perm-grid", "yes");
  }

  if(localStorage.getItem("perm-grid") === "yes") {
    $("body").addClass("perm-grid");
    $("#toggle-grid").attr('checked', 'checked');
  }

  placeGrid();
  placeWidgets();
});

var GRID_MIN_HEIGHT     = 3,
    GRID_MIN_WIDTH      = 7,
    GRID_MARGIN_TOP     = function() { return localStorage.getItem("showbmb") === "yes" ? 27 : 0; },
    GRID_MARGIN_LEFT    = 27,
    GRID_TILE_SIZE      = 200,  // NEVER CHANGE
    GRID_TILE_PADDING   = 3;    // NEVER CHANGE

// Handles permanent grid preference
function updateGridOpacity() {
  if ($("#toggle-grid").is(':checked')) {
    $("body").addClass("perm-grid");
    localStorage.setItem("perm-grid", "yes");
    $(".tile").css({opacity: 0});
  } else {
    $("body").removeClass("perm-grid");
    localStorage.setItem("perm-grid", "no");
    $(".tile").animate({opacity: 0});
  }
}

// Handles positioning and repositioning the grid
function moveGrid(pref) {
  if ( pref.animate_top === false ) {
    $("#widget-holder,#grid-holder").css({
      "-webkit-transition": "left .77s ease-in-out"
    });
  } else {
    $("#widget-holder,#grid-holder").css({
      "-webkit-transition": "left .77s ease-in-out, top .77s ease-in-out"
    });
  }

  $("#widget-holder,#grid-holder").css({
    "top" : GRID_MARGIN_TOP(),
    "left": GRID_MARGIN_LEFT
  });

  updateGridOpacity();
}

function placeGrid() {
  moveGrid({ "animate_top": false });
  var tile_template = '<li class="tile empty">&nbsp;</li>';

  var height = GRID_MIN_HEIGHT;
  var width = GRID_MIN_WIDTH;

  // Ensure window is filled with grid tiles
  if ( typeof(window.innerHeight) !== "undefined"
    && typeof(window.innerWidth) !== "undefined" ) {
    var res_height = Math.floor( ( window.innerHeight - GRID_MARGIN_TOP() ) / ( GRID_TILE_SIZE + ( GRID_TILE_PADDING * 2 ) ) );
    var res_width  = Math.floor( ( window.innerWidth  - GRID_MARGIN_LEFT  ) / ( GRID_TILE_SIZE + ( GRID_TILE_PADDING * 2 ) ) ) + 3;

    if(res_height > height) {
      height = res_height;
    }
    if(res_width > width) {
      width = res_width;
    }
  }
  if ( typeof(screen.width) !== "undefined"
    && typeof(screen.height) !== "undefined" ) {
    var res_height2 = Math.floor( ( screen.height - 150 - GRID_MARGIN_LEFT  ) / ( GRID_TILE_SIZE + ( GRID_TILE_PADDING * 2 ) ) );
    var res_width2  = Math.floor( ( screen.width        - GRID_MARGIN_LEFT  ) / ( GRID_TILE_SIZE + ( GRID_TILE_PADDING * 2 ) ) ) + 3;

    if(res_height2 > height) {
      height = res_height2;
    }
    if(res_width2 > width) {
      width = res_width2;
    }
  }

  widgets = JSON.parse(localStorage.getItem("widgets"));
  var placed_height = 0, placed_width = 0;

  // Ensure all placed widgets have a grid tile to land on
  if( typeof(widgets) === "object" ) {
    $.each(widgets, function(id, widget) {
      if( parseFloat(widget.where[0]) + parseFloat(widget.size[0]) > placed_height ) {
        placed_height = parseFloat(widget.where[0]) + parseFloat(widget.size[0]);
      }
      if( parseFloat(widget.where[1]) + parseFloat(widget.size[1]) + 3 > placed_width ) {
        placed_width  = parseFloat(widget.where[1]) + parseFloat(widget.size[1]) + 3;
      }
    });

    if(placed_height > height) {
      height = placed_height;
    }
    if(placed_width > width) {
      width = placed_width;
    }
  }

  // Actually place the grid
  for (var gx = 0; gx < height; gx++) {
    for (var gy = 0; gy < width; gy++) {
      $(tile_template).css({
        "position": "absolute",
        "top" : ( gx * GRID_TILE_SIZE ) + ( ( GRID_TILE_PADDING * 2 ) * ( gx + 1 ) ),
        "left": ( gy * GRID_TILE_SIZE ) + ( ( GRID_TILE_PADDING * 2 ) * ( gy + 1 ) )
      }).attr({
        "id": gx + "x" + gy,
        "data-land-top" : gx,
        "data-land-left": gy
      }).appendTo("#grid-holder");
    }
  }

  updateGridOpacity();
}

$(".empty").live({
  mouseenter: function() {
    $(this).addClass("add-shortcut");
  },
  mouseleave: function() {
    $(".tile").removeClass("add-shortcut");
  }
});

var update = true;
function makeZero(num){
  if(num < 0){
    num = 0;
  }
  return num;
}

function findClosest(tile){
  var closestElm = null;
  var boxX = $(tile).position().left;
  var boxY = $(tile).position().top;
  var distElm = -1;
  $(".tile").each(function(ind, elem){
    var closeX = $(elem).position().left;
    var closeY = $(elem).position().top;
    testElm = Math.pow(boxX - closeX, 2) + Math.pow(boxY - closeY, 2);
    if(testElm < distElm || distElm == -1){
      distElm = testElm;
      closestElm = elem;
    }
  });
  return closestElm;
}

// var cache = {};
function getCovered(tile) {
  var toRet = {};
  toRet.clear = true;
  toRet.tiles = [];
  var closestElm = findClosest(tile);

  // if(cache && cache.closest === closestElm && cache.tile === tile && cache.toRet) {
  //   return cache.toRet;
  // } else {
  //   cache = {}; cache.closest = closestElm; cache.tile = tile;
  // }

  var top  = parseInt( $(closestElm).attr("data-land-top")  , 10);
  var left = parseInt( $(closestElm).attr("data-land-left") , 10);

  var height = parseInt( $(tile).attr("data-tile-height")   , 10);
  var width  = parseInt( $(tile).attr("data-tile-width")    , 10);

  for (h=0; h<=(height-1); h++)
  {
    for (w=0; w<=(width-1); w++)
    {
      var temporary_tile = $("#"+(top+h)+"x"+(left+w)+".tile")[0];
      if( temporary_tile ) {
        (toRet.tiles).push( temporary_tile );

        if($( temporary_tile ).hasClass("empty") === false) {
          toRet.clear = false;
        }
      } else {
        toRet.clear = false;
      }
    }
  }

  // cache.toRet = toRet;

  return toRet;
}

function setStuff() {
  $(".widget").each(function(ind, elem){
    $(elem).css({
      "width" : $(elem).attr("data-tile-width")  * 200 + (makeZero($(elem).attr("data-tile-width")  - 1) * 6),
      "height": $(elem).attr("data-tile-height") * 200 + (makeZero($(elem).attr("data-tile-height") - 1) * 6),
      "left": $(elem).attr("initleft") * ( GRID_TILE_SIZE + ( GRID_TILE_PADDING * 2 ) ) + ( GRID_TILE_PADDING * 2 ),
      "top" : $(elem).attr("inittop")  * ( GRID_TILE_SIZE + ( GRID_TILE_PADDING * 2 ) ) + ( GRID_TILE_PADDING * 2 )
    });

    var closestElm = findClosest(this);
    var tiles = getCovered(this);

    $(this).css({
      "left": $(closestElm).position().left,
      "top" : $(closestElm).position().top,
      "z-index": "1"
    });

    $(tiles.tiles).each(function(ind, elem){
      $(elem).css("z-index", "0")
        .toggleClass("empty", false);
    });
  });

  // Trigger mouseup on escape key
  $(document).keyup(function(e) {
    if ( typeof(held_element.element) === "object" ) {
      if (e.which == 27) { $(held_element.element).trigger("mouseup"); }
    }
  });

  // When a tile is resized
  $(".resize-tile > div").live("mousedown", function(e) {
    console.log(this);

    e.preventDefault();
    e.stopPropagation();
  });

  var held_element = {};
  // When a tile is picked up
  $(".widget").live("mousedown", function(e) {
    if(lock === true) {
      held_element.element = false;
      return false;
    }

    $(".widget").css("z-index", "1");

    held_element.offsetX = e.offsetX;
    held_element.offsetY = e.offsetY;
    held_element.oldX    = $(this).position().left;
    held_element.oldY    = $(this).position().top;
    held_element.oldX    = $(this).position().left;
    held_element.width   = $(this).width();
    held_element.height  = $(this).height();

    if( $(this).attr("data-app-source") === "from-drawer" ) {
      held_element.element = $(this).clone()
        .addClass("widget-drag").css({
          "left": $(this).offset().left,
          "top" : $(this).offset().top,
          "position": "absolute",
          "z-index" : "100"
      }).prependTo("body");

      // Ensure that it's always droppable
      held_element.offsetX_required = $(held_element.element).width()  / 2;
      held_element.offsetY_required = $(held_element.element).height() / 2;

      $(".ui-2#apps,.ui-2#widgets").css("display", "none");
    } else {
      var tiles = getCovered(this);
      $(tiles.tiles).each(function(ind, elem){
        $(elem).toggleClass("empty", true);
      });

      $(this).addClass("widget-drag")
        .css("z-index", "100");

      held_element.element = this;
    }

    $(".resize-tile").css("display", "none");
    $(this).find(".resize-tile").css("display", "block");

    if ( e.preventDefault ) {
      e.preventDefault();
    }
  });

  // When a tile is released
  $(".widget").live("mouseup", function(e) {
    if (lock === true) {
      held_element.element = false;
      return false;
    }

    if ( held_element.element === false ) {
      return false;
    }

    update = true;

    var closestElm = findClosest(this);
    var tiles = getCovered(this);

    if ( tiles.clear === true ) {
      if( $(this).attr("data-app-source") === "from-drawer" && $(this).attr("data-widget") === "true" ) {
        addWidget(true,
          $(this).attr("id"),
          $(closestElm).attr("data-land-top"),
          $(closestElm).attr("data-land-left"),
          $(this).attr("data-widget-src"),
          $(this).attr("data-tile-width"),
          $(this).attr("data-tile-height"),
          $(this).attr("data-poke"),
          stock_widgets[$(this).attr("data-stock")]
        );
      } else if( $(this).attr("data-app-source") === "from-drawer") {
        addWidget(false,
          $(this).attr("id"),
          $(closestElm).attr("data-land-top"),
          $(closestElm).attr("data-land-left"),
          null, null, null, null, $(this).attr("data-stock")
        );
      } else {
        updateWidget($(this).attr("id"),
          $(closestElm).attr("data-land-top"),
          $(closestElm).attr("data-land-left")
        );
      }

      $(this).removeClass("widget-drag").css({
        "left": $(closestElm).position().left,
        "top" : $(closestElm).position().top,
        "z-index": "2"
      });

      $(tiles.tiles).each(function(ind, elem){
          $(elem).toggleClass("empty", false);
      });

    } else { // If the tile was full

      $(this).removeClass("widget-drag").css({
        "left": held_element.oldX,
        "top" : held_element.oldY,
        "z-index": "2"
      });

      tiles = getCovered(this);

      $(tiles.tiles).each(function(ind, elem){
        $(elem).toggleClass("empty", false);
      });
    }

    if( $(this).attr("data-app-source") === "from-drawer") {
      $(this).remove();
    }

    held_element.element = false;
    $(".tile").removeClass("tile-green tile-red")
      .css("z-index", "0");
  });

  // When a tile is held and moved
  $(document).live("mousemove", function(e) {
    if(lock === true) {
      held_element.element = false;
      return false;
    }

    if ( typeof(held_element.element) === "object" ) {
      if(update === true){
        update = false;
      } else {
        held_left = held_element.width / 2;
        held_top = held_element.height / 2;

        if( held_element.offsetX_required )
          held_left = held_element.offsetX_required;
        if( held_element.offsetY_required)
          held_top  = held_element.offsetY_required;

        $(held_element.element).css({
          "left": e.pageX - held_left - GRID_MARGIN_LEFT,
          "top" : e.pageY - held_top  - GRID_MARGIN_TOP()
        });
      }

      hscroll = true;

      var closestElm = findClosest(held_element.element);
      var tiles = getCovered(held_element.element);

      $(".tile").removeClass("tile-green tile-red")
        .css("z-index", "0");

      if ( tiles.clear === true ) {
        $(tiles.tiles).each(function(ind, elem){
          $(elem).addClass("tile-green")
            .css("z-index", "2");
        });
      } else {
        $(tiles.tiles).each(function(ind, elem){
          $(elem).addClass("tile-red")
            .css("z-index", "2");
        });
      }
    }
  });
} // End of setStuff

lock = true;
$("#lock-button,#unlock-button").live("click", function() {
  if(lock === true) {
    // Unlock
    lock = false;
    $("body").addClass("unlocked").removeClass("locked");
    localStorage.setItem("lock", false );
    $(".iframe-mask").removeClass("hidden");
    $("#lock-button").css("display", "block");
    $("#unlock-button").css("display", "none");
    $(".tile").addClass("tile-grid");

    $(".ui-2#apps .drawer-app .url").removeClass("url").addClass("disabled-url");
    setTimeout(function() {
      $(".ui-2#apps .drawer-app .url").removeClass("url").addClass("disabled-url");
    }, 1100);

  } else {
    // Lock
    lock = true;

    hscroll = true;

    $("body").addClass("locked").removeClass("unlocked");
    localStorage.setItem("lock", true );
    $(".iframe-mask").addClass("hidden");
    $("#unlock-button").css("display", "block");
    $("#lock-button").css("display", "none");
    $(".tile").removeClass("tile-grid");

    $(".ui-2#apps .drawer-app .disabled-url").removeClass("disabled-url").addClass("url");
    setTimeout(function() {
      $(".ui-2#apps .drawer-app .disabled-url").removeClass("disabled-url").addClass("url");
    }, 1100);
  }
});
