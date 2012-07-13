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


$(document).ready(function($) {
  $("#toggle-grid,#grid-holder").live("click", updateGridOpacity);

  if(localStorage.getItem("perm-grid") === null) {
    localStorage.setItem("perm-grid", "yes");
  }

  if(localStorage.getItem("perm-grid") === "yes") {
    $("body").addClass("perm-grid");
    $("#toggle-grid,#grid-holder").attr('checked', 'checked');
  }

  placeGrid();
  placeWidgets();
});

var GRID_MIN_HEIGHT     = 3,
    GRID_MIN_WIDTH      = 7,
    GRID_MARGIN_TOP     = function() { return localStorage.getItem("showbmb") === "yes" ? 27 : 0; },
    GRID_MARGIN_LEFT    = function() { return localStorage.getItem("hideLeftButtons") === "yes" ? 0 : 27; },
    GRID_TILE_SIZE      = 200,  // NEVER CHANGE
    GRID_TILE_PADDING   = 3,    // NEVER CHANGE

    TILE_MIN_WIDTH      = 1,
    TILE_MAX_WIDTH      = 3,
    TILE_MIN_HEIGHT     = 1,
    TILE_MAX_HEIGHT     = 3;

// Handles permanent grid preference
function updateGridOpacity() {
  if ($("#toggle-grid").is(':checked')) {
    $("body").addClass("perm-grid");
    localStorage.setItem("perm-grid", "yes");
    $(".tile").css({opacity: 0});
  } else {
    $("body").removeClass("perm-grid");
    localStorage.setItem("perm-grid", "no");
    $(".tile").css({opacity: 0});
  }
}

// Handles positioning and repositioning the grid
function moveGrid(pref) {
  if ( pref.animate_top === false ) {
    $("#widget-holder,#grid-holder").css({
      "-webkit-transition": "left .2s ease-in-out"
    });
  } else {
    $("#widget-holder,#grid-holder").css({
      "-webkit-transition": "left .2s ease-in-out, top .2s ease-in-out"
    });
  }

  $("#widget-holder,#grid-holder").css({
    "top" : GRID_MARGIN_TOP(),
    "left": GRID_MARGIN_LEFT()
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
    var res_width  = Math.floor( ( window.innerWidth  - GRID_MARGIN_LEFT()  ) / ( GRID_TILE_SIZE + ( GRID_TILE_PADDING * 2 ) ) ) + 3;

    if(res_height > height) {
      height = res_height;
    }
    if(res_width > width) {
      width = res_width;
    }
  }

  if ( typeof(screen.width) !== "undefined"
    && typeof(screen.height) !== "undefined" ) {
    var res_height2 = Math.floor( ( screen.height - 180 - GRID_MARGIN_TOP()  ) / ( GRID_TILE_SIZE + ( GRID_TILE_PADDING * 2 ) ) );
    var res_width2  = Math.floor( ( screen.width        - GRID_MARGIN_LEFT()  ) / ( GRID_TILE_SIZE + ( GRID_TILE_PADDING * 2 ) ) ) + 3;

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

  // For performance reasons, never allow the grid to get excessively
  // wide / tall, no matter what the reason
  height = (height > 25) ? 25 : height; //  5,144 px
  width  = (width  > 50) ? 50 : width ; // 10,294 px

  // Actually place the grid
  for (var gx = 0; gx < height; gx++) {
    for (var gy = 0; gy < width; gy++) {
      $(tile_template).css({
        "position": "absolute",
        "top" : ( gx * GRID_TILE_SIZE ) + ( ( GRID_TILE_PADDING * 2 ) * ( gx + 1 ) ),
        "left": ( gy * GRID_TILE_SIZE ) + ( ( GRID_TILE_PADDING * 2 ) * ( gy + 1 ) )
      }).attr("id", gx + "x" + gy).attr({
        "land-top" : gx,
        "land-left": gy
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

function getCovered(tile) {
  var toRet = {};
  toRet.clear = true;
  toRet.tiles = [];
  var closestElm = findClosest(tile);

  var top  = parseInt( $(closestElm).attr("land-top")  , 10);
  var left = parseInt( $(closestElm).attr("land-left") , 10);

  var height = parseInt( $(tile).attr("tile-height")   , 10);
  var width  = parseInt( $(tile).attr("tile-width")    , 10);

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

  return toRet;
}

function setStuff() {
  $(".widget").each(function(ind, elem){
    $(elem).css({
      "width" : $(elem).attr("tile-width")  * 200 + (makeZero($(elem).attr("tile-width")  - 1) * 6),
      "height": $(elem).attr("tile-height") * 200 + (makeZero($(elem).attr("tile-height") - 1) * 6),
      "left": $(elem).attr("tile-init-left") * ( GRID_TILE_SIZE + ( GRID_TILE_PADDING * 2 ) ) + ( GRID_TILE_PADDING * 2 ),
      "top" : $(elem).attr("tile-init-top")  * ( GRID_TILE_SIZE + ( GRID_TILE_PADDING * 2 ) ) + ( GRID_TILE_PADDING * 2 )
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
}

  // Trigger mouseup on escape key
  $(document).keyup(function(e) {
    if (e.which == 27) {
      if ( typeof(held_element.element) === "object" ) {
        $(held_element.element).trigger("mouseup");
      }
      if ( typeof(resize_element.element) === "object" )
      $(".resize-tile > div").trigger("mouseup");

      // Close all UI-2 elements
      $(".ui-2.x").trigger("click");

      $(".ui-2#editor .iframe-mask").removeClass("filesystem-drop-area");
    }
  });

  $(window).mouseup("mouseup", function(e) {
    if ( typeof(resize_element.element) === "object" ) {
      $(".resize-tile > div").trigger("mouseup");
    }
  });

  /* START :: Resize */

    resize_element = {};
    resize_element.element = false;
    // When a tile resize square is clicked
    $(".resize-tile > div").live("mousedown", function(e) {
      if ( lock === true ) {
        resize_element.element = false;
        return false;
      }

      $(".ui-2.x").trigger("click");

      switch ( $(this).attr("class") ) {
        case "resize-tile-top":
          resize_element.side = "top";    break;
        case "resize-tile-bottom":
          resize_element.side = "bottom"; break;
        case "resize-tile-left":
          resize_element.side = "left";   break;
        case "resize-tile-right":
          resize_element.side = "right";  break;
        default:
          return console.error("Resize Mousedown", "Invalid side.");
      }
      widgets = JSON.parse(localStorage.getItem("widgets"));


      resize_element.element = $(this).closest(".widget")[0];
      var id = $(resize_element.element).attr("id");

      if ( typeof(widgets[id]) === "object"
        && typeof(widgets[id].resize) === "boolean"
        && typeof(widgets[id].v2) === "object"
        && widgets[id].resize === true ) {
        resize_element.v2         = widgets[id].v2;
      } else {
        resize_element.element = false;
        return console.error("Resize Mousedown", resize_element.side, "Tile storage discrepancy; tile not resizable.");
      }

      resize_element.top     = $(resize_element.element).position().top;
      resize_element.left    = $(resize_element.element).position().left;
      resize_element.width   = $(resize_element.element).width();
      resize_element.height  = $(resize_element.element).height();
      resize_element.clientX = e.clientX;
      resize_element.clientY = e.clientY;
      resize_element.tileH   = $(resize_element.element).attr("tile-height");
      resize_element.tileW   = $(resize_element.element).attr("tile-width");
      resize_element.moved_left = 0;
      resize_element.moved_top  = 0;

      $(getCovered( resize_element.element ).tiles).addClass("empty");

      $(resize_element.element).find("#shortcut-edit,#delete,#widget-config").addClass("force-hide");

      $(resize_element.element)
        .addClass("widget-resize");

      e.preventDefault();
      e.stopPropagation();
    });

    // When a tile resize square is released
    $(document).live("mousemove", function(e) {
      if ( lock === true ) {
        resize_element.element = false;
        return false;
      }

      if ( typeof(resize_element.element) !== "object" ) {
        return;
      }

      var new_width = 0;
      var new_height = 0;
      switch ( resize_element.side ) {
        case "top":
          new_height = ( resize_element.clientY - e.clientY ) + resize_element.height;
          new_top    = resize_element.top - ( resize_element.clientY - e.clientY );

          new_height = calcHeight({
            "height": new_height,
            "min"  : resize_element.v2.min_height,
            "max"  : resize_element.v2.max_height
          });

          if ( new_height.height <= calcHeight({"is": resize_element.v2.min_height}).height
            || new_height.height >= calcHeight({"is": resize_element.v2.max_height}).height ) return;

          resize_element.moved_top = ( resize_element.clientY - e.clientY );

          if( new_top < (GRID_TILE_PADDING*2) ) {
            new_top = (GRID_TILE_PADDING*2);
            return;
          }

          $(resize_element.element).css({
            "height" : new_height.height,
            "top"  : new_top
          }).attr({"tile-height": new_height.new_y});

          break;
        case "bottom":
          new_height = ( e.clientY - resize_element.clientY ) + resize_element.height;

          new_height = calcHeight({
            "height": new_height,
            "min"  : resize_element.v2.min_height,
            "max"  : resize_element.v2.max_height
          });

          $(resize_element.element).css({
            "height" : new_height.height
          }).attr({"tile-height": new_height.new_y});

          break;
        case "left":
          new_width = ( resize_element.clientX - e.clientX ) + resize_element.width;
          new_left  = resize_element.left - ( resize_element.clientX - e.clientX );

          new_width = calcWidth({
            "width": new_width,
            "min"  : resize_element.v2.min_width,
            "max"  : resize_element.v2.max_width
          });

          if ( new_width.width <= calcWidth({"is": resize_element.v2.min_width}).width
            || new_width.width >= calcWidth({"is": resize_element.v2.max_width}).width ) return;

          resize_element.moved_left = ( resize_element.clientX - e.clientX );

          if( new_left < (GRID_TILE_PADDING*2) ) {
            new_left = (GRID_TILE_PADDING*2);
            return;
          }

          $(resize_element.element).css({
            "width" : new_width.width,
            "left"  : new_left
          }).attr({"tile-width": new_width.new_x});

          break;
        case "right":
          new_width = ( e.clientX - resize_element.clientX ) + resize_element.width;

          new_width = calcWidth({
            "width": new_width,
            "min"  : resize_element.v2.min_width,
            "max"  : resize_element.v2.max_width
          });

          $(resize_element.element).css({
            "width" : new_width.width
          }).attr({"tile-width": new_width.new_x});

          break;
      }
    });

    function calcWidth(obj) {
      if ( obj.width === undefined ) obj.width = 0;
      if ( obj.is !== undefined) obj.min = obj.max = obj.is;
      obj.min = ( obj.min < TILE_MIN_WIDTH ) ? TILE_MIN_WIDTH : obj.min;
      obj.max = ( obj.max > TILE_MAX_WIDTH ) ? TILE_MAX_WIDTH : obj.max;
      if ( obj.width < ( (GRID_TILE_SIZE * obj.min) + ((GRID_TILE_PADDING*2)*(obj.min-1)) ) ) {
        obj.width = ( (GRID_TILE_SIZE * obj.min) + ((GRID_TILE_PADDING*2)*(obj.min-1)) );
      }
      if ( obj.width > ( (GRID_TILE_SIZE * obj.max) + ((GRID_TILE_PADDING*2)*(obj.max-1)) ) ) {
        obj.width = ( (GRID_TILE_SIZE * obj.max) + ((GRID_TILE_PADDING*2)*(obj.max-1)) );
      }

      return {
        "width" : obj.width,
        "new_x" : Math.ceil( obj.width / (GRID_TILE_SIZE + (GRID_TILE_PADDING * 2)) )
      };
    }

    function calcHeight(obj) {
      if ( obj.height === undefined ) obj.height = 0;
      if ( obj.is !== undefined) obj.min = obj.max = obj.is;
      obj.min = ( obj.min < TILE_MIN_HEIGHT ) ? TILE_MIN_HEIGHT : obj.min;
      obj.max = ( obj.max > TILE_MAX_HEIGHT ) ? TILE_MAX_HEIGHT : obj.max;
      if ( obj.height < ( (GRID_TILE_SIZE * obj.min) + ((GRID_TILE_PADDING*2)*(obj.min-1)) ) ) {
        obj.height = ( (GRID_TILE_SIZE * obj.min) + ((GRID_TILE_PADDING*2)*(obj.min-1)) );
      }
      if ( obj.height > ( (GRID_TILE_SIZE * obj.max) + ((GRID_TILE_PADDING*2)*(obj.max-1)) ) ) {
        obj.height = ( (GRID_TILE_SIZE * obj.max) + ((GRID_TILE_PADDING*2)*(obj.max-1)) );
      }

      return {
        "height" : obj.height,
        "new_y" : Math.ceil( obj.height / (GRID_TILE_SIZE + (GRID_TILE_PADDING * 2)) )
      };
    }

    // When a tile resize square is released
    $(".resize-tile > div, .widget").live("mouseup", function(e) {
      if ( lock === true ) {
        resize_element.element = false;
        return false;
      }

      if ( typeof(resize_element.element) !== "object" ) {
        return;
      }

      var left = $(resize_element.element).position().left;
      var column, bracket;
      for (var col = 1; col < 50; col++) {
        bracket = ((GRID_TILE_SIZE * (col-0)) + (GRID_TILE_PADDING * 2) * (col-0)) + 6;
        if ( bracket > left+5 ) {
          new_left  = ((GRID_TILE_SIZE * (col-1)) + (GRID_TILE_PADDING * 2) * (col-1)) + 6;

          column = col - 1;

          $(resize_element.element).css({
            "left": new_left
          }).attr("land-left", col);
          break;
        }
      }

      var top = $(resize_element.element).position().top;
      var row;
      for (var _row = 1; _row < 50; _row++) {
        bracket = ((GRID_TILE_SIZE * (_row-0)) + (GRID_TILE_PADDING * 2) * (_row-0)) + 6;
        if ( bracket > top+5 ) {
          new_top  = ((GRID_TILE_SIZE * (_row-1)) + (GRID_TILE_PADDING * 2) * (_row-1)) + 6;

          row = _row - 1;

          $(resize_element.element).css({
            "top": new_top
          }).attr("land-top", _row);
          break;
        }
      }

      $(resize_element.element).css({
        "width" : calcWidth ({"is": $(resize_element.element).attr("tile-width")  }).width,
        "height": calcHeight({"is": $(resize_element.element).attr("tile-height") }).height
      }).removeClass("widget-resize");

      if ( getCovered( resize_element.element ).clear === true ) {
        updateWidget({
          "id"    : $(resize_element.element).attr("id"),
          "width" : $(resize_element.element).attr("tile-width"),
          "height": $(resize_element.element).attr("tile-height"),
          "left"  : column,
          "top"   : row
        });
      } else {
        $(resize_element.element).css({
          "width" : resize_element.width,
          "height": resize_element.height,
          "left"  : resize_element.left,
          "top"   : resize_element.top
        }).attr({
          "tile-width" : resize_element.tileW,
          "tile-height": resize_element.tileH
        });
      }

      $(getCovered( resize_element.element ).tiles).removeClass("empty");

      $(resize_element.element).find("#shortcut-edit,#delete,#widget-config").removeClass("force-hide");

      resize_element.element = false;

      e.preventDefault();
      e.stopPropagation();
    });

    /* END :: Resize */

  /* START :: Move */

    var held_element = {};

    held_element.element = false;
    // When a tile is picked up
    $(".widget").live("mousedown", function(e) {
      if(lock === true) {
        held_element.element = false;
        return false;
      }

      $(".ui-2.x").trigger("click");

      $(".widget").css("z-index", "1");

      held_element.offsetX = e.offsetX;
      held_element.offsetY = e.offsetY;
      held_element.oldX    = $(this).position().left;
      held_element.oldY    = $(this).position().top;
      held_element.width   = $(this).width();
      held_element.height  = $(this).height();

      if( $(this).attr("app-source") === "from-drawer" ) {
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
      if ( lock === true ) {
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
        if( $(this).attr("app-source") === "from-drawer" && $(this).attr("tile-widget") === "true" ) {
          var is_widget = true,
              src       = $(this).attr("tile-widget-src"),
              width     = $(this).attr("tile-width"),
              height    = $(this).attr("tile-height"),
              poke      = $(this).attr("poke"),
              stock     = stock_widgets[$(this).attr("stock")];
        } else if ( $(this).attr("app-source") === "from-drawer" && $(this).attr("widget") === undefined ) {
          var is_widget = false,
              src       = undefined,
              width     = 1,
              height    = 1,
              poke      = undefined,
              stock     = $(this).attr("stock");
        }

        if ( $(this).attr("app-source") === "from-drawer" ) {
          addWidget({
            "is_widget" : is_widget,
            "widget"    : $(this).attr("id"),
            "top"       : $(closestElm).attr("land-top"),
            "left"      : $(closestElm).attr("land-left"),
            "src"       : src,
            "width"     : width,
            "height"    : height,
            "stock"     : stock,
            "poke"      : poke,
            "resize"    : $(this).attr("resize"),
            "min_width" : parseInt($(this).attr("min_width")),
            "max_width" : parseInt($(this).attr("max_width")),
            "min_height": parseInt($(this).attr("min_height")),
            "max_height": parseInt($(this).attr("max_height"))
          })
        }

        if ( $(this).attr("app-source") !== "from-drawer" ) {
          updateWidget({
            "id"  : $(this).attr("id"),
            "top" : $(closestElm).attr("land-top"),
            "left": $(closestElm).attr("land-left")
          });
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

        $(held_element.element).removeClass("widget-drag").css({
          "left": held_element.oldX,
          "top" : held_element.oldY,
          "z-index": "2"
        });

        tiles = getCovered(this);

        $(tiles.tiles).each(function(ind, elem){
          $(elem).toggleClass("empty", false);
        });
      }

      if ( $(held_element.element).attr("app-source") === "from-drawer") {
        $(held_element.element).remove();
      }
      $("body > .widget-drag").remove();

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
      if ( held_element.element === false ) {
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
            "left": e.pageX - held_left - GRID_MARGIN_LEFT(),
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
    /* END :: Move */


  /* START :: Lock */
    $(document).ready(function() {
      if(localStorage.getItem("lock") === "false") {
        $('#unlock-button').trigger('click');
      } else {
        $("body").addClass("locked").removeClass("unlocked");
      }
    });

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

        if ( localStorage.getItem("hideLeftButtons") === "yes" ) {
          $(".side-button").css("left", "0px");
          $("#widget-holder,#grid-holder").css("left", "27px");
        }
      } else {
        // Lock
        lock = true;
        $(".resize-tile").hide();

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

    /* END :: Lock */