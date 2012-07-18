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


/* START :: Windows */

  $(document).ready(function($) {
    $(".ui-2.container").center();

    $(window).bind('resize scroll', function() {
      $(".ui-2.container").center();
    });

    (function() {
      var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
      po.src = 'https://apis.google.com/js/plusone.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();
  });

  $(".close,.ui-2.x").live("click", closeButton);

  function closeButton(exclude) {

    if ( exclude && typeof(exclude) === "string" ) {
      $("body > .ui-2,#recently-closed-tabs-menu")
        .not(exclude)
        .hide();
    } else {
      $("body > .ui-2,#recently-closed-tabs-menu").hide();
    }

    window.location.hash = "";
    hscroll = true;
  }

  var options_init = true;
  $("#config-button, .ui-2.config").live("click", function(){
    _gaq.push([ '_trackEvent', 'Window', "Config" ]);

    closeButton(".ui-2#config");
    $(".ui-2#config").toggle();
  });

  $("#logo-button,.ui-2.logo").live("click", function(){
    _gaq.push([ '_trackEvent', 'Window', "About" ]);

    closeButton(".ui-2#about");
    $(".ui-2#about").toggle();

    if(options_init === true) {
      options_init = false;

      (function() {
        var s = document.createElement('script'), t = document.getElementsByTagName('script')[0];
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://api.flattr.com/js/0.6/load.js?mode=auto';
        t.parentNode.insertBefore(s, t);
      })();

      (function() {
        var twitterScriptTag = document.createElement('script');
        twitterScriptTag.type = 'text/javascript';
        twitterScriptTag.async = true;
        twitterScriptTag.src = 'https://platform.twitter.com/widgets.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(twitterScriptTag, s);
      })();
    }
  });

  /* END :: Windows */

/* START :: Top Left Buttons */

  function moveLeftButtons() {
    if ( localStorage.getItem("hideLeftButtons") === "yes" &&
      localStorage.getItem("lock") !== "false" ) {
      $(".side-button").css("left", "-50px");
      $("#widget-holder,#grid-holder").css("left", "0px");
    }
    if ( localStorage.getItem("hideLeftButtons") === "yes") {
      $("#hideLeftButtons").attr('checked', 'checked');
    }
    if ( localStorage.getItem("hideLeftButtons") !== "yes" ) {
      $(".side-button").css("left", "0px");
      $("#widget-holder,#grid-holder").css("left", "27px");
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
      if ( localStorage.getItem("hideLeftButtons") === "yes" ) {

        $(".side-button").css("left", "0px");
        $("#widget-holder,#grid-holder").css("left", "27px");
      }

    },
    mouseleave: function() {
      if ( localStorage.getItem("hideLeftButtons") === "yes"
        && localStorage.getItem("lock") === "true" ) {

        $(".side-button").css("left", "-50px");
        $("#widget-holder,#grid-holder").css("left", "0px");
      }
    }
  });

  /* END :: Top Left Buttons */

/* START :: Recently Closed Tabs */

  $("#recently-closed-tabs-menu").live('mouseleave', function() {
    $(this).css("display", "none");
  });

  $("#recently-closed-tabs").live('click', function() {
    _gaq.push([ '_trackEvent', 'Window', "Recently Closed Tabs" ]);

    closeButton("#recently-closed-tabs-menu");
    $("#recently-closed-tabs-menu").toggle();
  });

  $(window).bind('storage', function (e) {
    if ( typeof(e.originalEvent) === "object"
      && typeof(e.originalEvent.key) === "string"
      && e.originalEvent.key === "recently_closed" )
        resetRecentlyClosedTabs();
  });

  function deleteRecentlyClosedTabById(id)
  {
    var recently_closed = JSON.parse(localStorage.getItem("recently_closed"));
    recently_closed.splice(id, 1);
    localStorage.setItem("recently_closed", JSON.stringify(recently_closed));
    resetRecentlyClosedTabs();
  }

  function resetRecentlyClosedTabs() {
    var recently_closed = JSON.parse(localStorage.getItem("recently_closed"));

    $("#recently-closed-tabs-menu").empty();

    if(recently_closed !== null) {
      $.each(recently_closed, function(id, tab) {
        var rct_temp = $("<a></a>").addClass("rctm-item").attr({
          "href": tab.url,
          "target": "_top"
        });
        var tempDiv = $("<div></div>").appendTo(rct_temp).addClass("rctm-link");
        $("<img style='float: left;'></div></img>").appendTo(rct_temp).addClass("rctm-icon")
              .attr("src", "chrome://favicon/"+tab.url);
        $("<div style='float: left;'></div>").appendTo(tempDiv).text(tab.title);
        $('<div style="float: right; position: relative; top: 3px;"><img data-rctm_item_id="' + id + '" class="rctm_item_close_btn" src="widgets/close.png" title="Close"></div>').appendTo(tempDiv);
        rct_temp.appendTo("#recently-closed-tabs-menu");
      });
      $('<div style="width: 50%; margin: 0 auto;"><a href="#" id="rctm_clear_all">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + chrome.i18n.getMessage("rctm_clear_all_text") + '</a></div>').appendTo("#recently-closed-tabs-menu");
      // setting event handlers
      $('.rctm_item_close_btn').bind('click', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        //
        var sItemId = $(evt.target).attr('data-rctm_item_id');
        deleteRecentlyClosedTabById(sItemId);
      });

      $('#rctm_clear_all').bind('click', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        //
        if (confirm(chrome.i18n.getMessage("rctm_clear_all_confirm")))
        {
          localStorage.removeItem("recently_closed");
        }
        resetRecentlyClosedTabs();
      });
    }
  }

  function storageEventHandlerForRct(evt)
  {
    if ('recently_closed' === evt.key)
    {
      resetRecentlyClosedTabs();
    }
  }

  window.addEventListener("storage", storageEventHandlerForRct, false);

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
        name: 'light',
        tip: 'topLeft'
      }
    };

    var qtipUI2 = {
      show: 'mouseover',
      hide: 'mouseout',
      style: {
        name: 'light',
        tip: 'topMiddle'
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
    };

    $(".ui-2.widgets-refresh").qtip(
      $.extend({}, qtipUI2, { content: "Widgets not showing up? Refresh manually." })
    );
    $(".ui-2.x").qtip(
      $.extend({}, qtipUI2, { content: chrome.i18n.getMessage("ui_button_close") })
    );
    $(".ui-2.help").qtip(
      $.extend({}, qtipUI2, { content: "Help" })
    );

    $(".ui-2.config,#config-button").qtip(
      $.extend({}, qtipUI2, { content: chrome.i18n.getMessage("ui_config") })
    );

    $(".ui-2#apps .download").qtip(
      $.extend({}, qtipUI2, { content: chrome.i18n.getMessage("ui_button_downloadapps") })
    );

    $(".ui-2#widgets .download").qtip(
      $.extend({}, qtipUI2, { content: chrome.i18n.getMessage("ui_button_download") })
    );

    $("#logo-button").qtip(
      $.extend({}, qtipShared, { content: "About" })
    );
    $("#app-drawer-button").qtip(
      $.extend({}, qtipShared, { content: chrome.i18n.getMessage("ui_button_apps") })
    );
    $("#widget-drawer-button").qtip(
      $.extend({}, qtipShared, { content: chrome.i18n.getMessage("ui_button_widgets") })
    );
    $("#unlock-button").qtip(
      $.extend({}, qtipShared, { content: chrome.i18n.getMessage("ui_button_unlock") })
    );
    $("#lock-button").qtip(
      $.extend({}, qtipShared, { content: chrome.i18n.getMessage("ui_button_lock") })
    );
    $("#recently-closed-tabs").qtip(
      $.extend({}, qtipShared, { content: chrome.i18n.getMessage("ui_button_rct") })
    );

    $("#tmp-contest").qtip(
      $.extend({}, qtipShared, { content: "Giveaway of Awesomeness" })
    );

  });

  /* END :: Tooltips */

/* START :: Configure */

  $(document).ready(function($) {
    if(window.location.hash) {
      switch(window.location.hash) {
        case "#options":
          $("#config-button").trigger("click");
          break;
      }
    }

    if(localStorage.getItem("showbmb") === null) {
      localStorage.setItem("showbmb", "no");
    }

    bookmark_bar_rendered = false;
    if(localStorage.getItem("showbmb") === "yes") {
      $("#toggleBmb").attr('checked', 'checked');
      bookmark_bar_rendered = true;
      chrome.bookmarks.getTree(getBookmarks);
      $("#bookmarksBar").css("display", "block");
    } else {
      $("#bookmarksBar").css("display", "none");
    }

    if(localStorage.getItem("bg-img-css") && localStorage.getItem("bg-img-css") !== "") {
      $("body").css("background", localStorage.getItem("bg-img-css") );
      $("#bg-img-css").val( localStorage.getItem("bg-img-css") );
    }
  });

  $(document).ready(function($) {
    $("#amazon-locale-selection").val(localStorage.getItem("amazon-locale") || "amazon.com");
    $("#amazon-locale-selection").change(function() {
      localStorage.setItem("amazon-locale", $(this).val());
    });

    $("#colorselector-bg").ColorPicker({
      color: '#' + ( localStorage.getItem("color-bg") || "221f20") ,
      onShow: function (colpkr) {
        $(colpkr).fadeIn(500);
        return false;
      },
      onHide: function (colpkr) {
        $(colpkr).fadeOut(500);
        return false;
      },
      onChange: function (hsb, hex, rgb) {
        $(".bg-color").css('background-color', '#' + hex);
        localStorage.setItem("color-bg", hex);
      }
    });
  });

  $(".bg-color").css("background-color", "#" + (localStorage.getItem("color-bg") || "221f20"));

  $("#import-export-btn").bind("click", function() {
    //alert('Ok');
    //$("#config-contents>div:not(#import-export)").slideUp(700);
    $("#config-contents>div:not(#import-export-contents)").slideUp(700);
    $("#import-export-contents").slideDown(700);
  });

  $("#import-export-btn2").bind("click", function() {
    //alert('Ok');
    //$("#config-contents>div:not(#import-export)").slideUp(700);
    $("#config-contents>div:not(#import-export-contents)").slideDown(700);
    $("#import-export-contents").slideUp(700);
});

  $("#toggleBmb").live("click", function(){
    if ($(this).is(':checked')) {
      if ( bookmark_bar_rendered === false ) {
        bookmark_bar_rendered = true;
        chrome.bookmarks.getTree(getBookmarks);
      }

      $("#bookmarksBar").show();
      localStorage.setItem("showbmb", "yes");
      moveGrid({ "animate_top": true });
    } else {
      $("#bookmarksBar").hide();
      localStorage.setItem("showbmb", "no");
      moveGrid({ "animate_top": true });
    }
  });

  $("#bg-img-css").live("keyup change", function() {
    $("body").css("background", "" );
    $("body").css("background", $(this).val() );
    $(".bg-color").css("background-color", '#' + (localStorage.getItem("color-bg") || "221f20") );

    if($(this).val() === "") {
      $(".bg-color").css("background-color", "#" + (localStorage.getItem("color-bg") || "221f20"));
    }

    localStorage.setItem("bg-img-css", $(this).val() );
  });

  /* END :: Configure */

