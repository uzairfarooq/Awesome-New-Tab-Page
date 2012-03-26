/*
 *
 *  Awesome New Tab Page
 *    http://antp.co/
 *    Copyright 2011+ Michael Hart (http://h4r7.me/).
 *
 *  Want to make it even more awesome?
 *    https://github.com/michaelhart/Awesome-New-Tab-Page/
 *
 *  UI (User Interface)
 *    JavaScript essential to the global user interface.
 *
 *  Licensed under GPL v3:
 *    http://www.gnu.org/licenses/gpl-3.0.txt
 *
 */

/* START :: Top Left Buttons */

  function moveLeftButtons() {
    if ( localStorage.getItem("hideLeftButtons") === "yes" ) {
      $(".side-button").css("left", "-50px");
      $("#hideLeftButtons").attr('checked', 'checked');
    } else {
      $(".side-button").css("left", "0px");
    }
  }

  $(document).ready(function($) {
    moveLeftButtons();
  });

  $("#hideLeftButtons").live("click", function(){
    if ($(this).is(':checked')) {
      localStorage.setItem("hideLeftButtons", "yes");
      moveLeftButtons();
    } else {
      localStorage.setItem("hideLeftButtons", "no");
      moveLeftButtons();
    }
  });

  $("#top-buttons").live({
    mouseenter: function() {
      if ( localStorage.getItem("hideLeftButtons") === "yes" )
        $(".side-button").css("left", "0px");
    },
    mouseleave: function() {
      if ( localStorage.getItem("hideLeftButtons") === "yes" )
        $(".side-button").css("left", "-50px");
    }
  });

  /* END :: Top Left Buttons */

/* START :: Recently Closed Tabs */

  $("#recently-closed-tabs-menu").live('mouseleave', function() {
    $(this).css("display", "none");
  });

  $("#recently-closed-tabs").live('click', function() {
    $(".close,.ui-2.x").trigger("click");
    $("#recently-closed-tabs-menu").toggle();
  });

  $(window).bind('storage', function (e) {
    if ( typeof(e.originalEvent) === "object"
      && typeof(e.originalEvent.key) === "string"
      && e.originalEvent.key === "recently_closed" )
        resetRecentlyClosedTabs();
  });

  function resetRecentlyClosedTabs() {
    var recently_closed = JSON.parse(localStorage.getItem("recently_closed"));

    $("#recently-closed-tabs-menu").empty();

    if(recently_closed !== null) {
      $.each(recently_closed, function(id, tab) {
        $(' <a class="rctm-item" href="'+tab.url+'" target="_top">\
              <div class="rctm-icon">\
                <img src="chrome://favicon/'+tab.url+'">\
              </div>\
              <div class="rctm-link">'+ tab.title +'</div>\
            </a>').appendTo("#recently-closed-tabs-menu");
      });
    }
  }
  $(document).ready(function($) {
    setTimeout(resetRecentlyClosedTabs, 500);
  });

  /* END :: Recently Closed Tabs */

/* START :: Tooltips */

  $(document).ready(function($) {
    var qtipShared = {
      show: 'mouseover',
      hide: 'mouseout',
      style: {
        name: 'dark',
        tip: 'leftMiddle',
      },
      position: {
        corner: {
           target: 'rightMiddle',
           tooltip: 'leftMiddle'
        }
      }
    }

    var qtipUI2 = {
      show: 'mouseover',
      hide: 'mouseout',
      style: {
        name: 'dark',
        tip: 'topMiddle',
      },
      position: {
        corner: {
           target: 'bottomMiddle',
           tooltip: 'topMiddle'
        },
        adjust: {
          screen: true
        }
      }
    }

    $(".ui-2.x").qtip(
      $.extend({}, qtipUI2, { content: chrome.i18n.getMessage("ui_button_close") || "Close" })
    );
    $(".ui-2.help").qtip(
      $.extend({}, qtipUI2, { content: "Help" })
    );

    $(".ui-2.config").qtip(
      $.extend({}, qtipUI2, { content: "Configure" })
    );

    $(".ui-2#apps .download").qtip(
      $.extend({}, qtipUI2, { content: "Download Apps" })
    );

    $(".ui-2#widgets .download").qtip(
      $.extend({}, qtipUI2, { content: chrome.i18n.getMessage("ui_button_download") || "Download Widgets" })
    );

    $("#logo-button").qtip(
      $.extend({}, qtipShared, { content: "About Awesome New Tab Page" })
    );
    $("#config-button").qtip(
      $.extend({}, qtipShared, { content: "Configure" })
    );
    $("#app-drawer-button").qtip(
      $.extend({}, qtipShared, { content: chrome.i18n.getMessage("ui_button_apps") || "Apps" })
    );
    $("#widget-drawer-button").qtip(
      $.extend({}, qtipShared, { content: chrome.i18n.getMessage("ui_button_widgets") || "Widgets" })
    );
    $("#unlock-button").qtip(
      $.extend({}, qtipShared, { content: chrome.i18n.getMessage("ui_button_unlock") || "Unlock" })
    );
    $("#lock-button").qtip(
      $.extend({}, qtipShared, { content: chrome.i18n.getMessage("ui_button_lock") || "Lock to Interact with Apps and Widgets" })
    );
    $("#recently-closed-tabs").qtip(
      $.extend({}, qtipShared, { content: chrome.i18n.getMessage("ui_button_rct") || "Recently Closed Tabs" })
    );

  });

  /* END :: Tooltips */