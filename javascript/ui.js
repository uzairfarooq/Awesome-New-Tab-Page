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

/* START :: Windows */

  $(document).ready(function($) {
    $(".ui-2.container").center();

    $(window).bind('resize scroll', function() {
      $(".ui-2.container").center();
    });
  });

  $(".close,.ui-2.x").live("click", function(){
    $("body > .ui-2").fadeOut();
    $("#recently-closed-tabs-menu").fadeOut();

    $(".edit-shortcut-ui").remove();

    window.location.hash = "";
    hscroll = true;
  });

  $("#app-drawer-button").live("click", function(){
    loadFeatured();
    _gaq.push([ '_trackEvent', 'Window', "Apps" ]);

    $(".ui-2#apps").fadeToggle();

    $(".ui-2#widgets").fadeOut();
    $(".ui-2#config").fadeOut();
    $("#recently-closed-tabs-menu").fadeOut();
    $(".ui-2#about").fadeOut();

    $(".ui-2#editor").fadeOut();
    $(".edit-shortcut-ui").remove();
  });

  var options_init = true;
  $("#config-button, .ui-2.config").live("click", function(){
    _gaq.push([ '_trackEvent', 'Window', "Config" ]);

    $(".ui-2#config").fadeToggle();

    $(".ui-2#widgets").fadeOut();
    $(".ui-2#apps").fadeOut();
    $("#recently-closed-tabs-menu").fadeOut();
    $(".ui-2#about").fadeOut();

    $(".ui-2#editor").fadeOut();
    $(".edit-shortcut-ui").remove();
  });

  $("#logo-button, .ui-2.logo").live("click", function(){
    _gaq.push([ '_trackEvent', 'Window', "About" ]);

    $(".ui-2#about").fadeToggle();

    if(options_init === true) {
      options_init = false;

      (function() {
        var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
        po.src = 'https://apis.google.com/js/plusone.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
      })();

      (function() {
          var s = document.createElement('script'), t = document.getElementsByTagName('script')[0];
          s.type = 'text/javascript';
          s.async = true;
          s.src = 'http://api.flattr.com/js/0.6/load.js?mode=auto';
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

    $(".ui-2#widgets").fadeOut();
    $(".ui-2#apps").fadeOut();
    $("#recently-closed-tabs-menu").fadeOut();
    $(".ui-2#config").fadeOut();

    $(".ui-2#editor").fadeOut();
    $(".edit-shortcut-ui").remove();
  });

  /* END :: Windows */

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
    _gaq.push([ '_trackEvent', 'Window', "Recently Closed Tabs" ]);
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

    $(".ui-2.widgets-refresh").qtip(
      $.extend({}, qtipUI2, { content: "Widgets not showing up? Refresh manually." })
    );
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

/* START :: Featured */
  var loaded_featured = false;
  function loadFeatured() {
    if(loaded_featured === false) {
      $.ajax({
        url: "https://cdn.antp.co/getFeatured/?nocache-day=" + new Date().getDate(),
        dataType: "jsonp",
        cache: true,
        jsonpCallback: "setupFeatured",
        success: setupFeatured
      });
    }
  }

  function setupFeatured(data) {
    loaded_featured = true;

    if( typeof(data.a) === "object" ) {
      if( typeof(data.a.app) === "object" ) {
        $(".ui-2#apps .faw-box .faw-featured img").attr("src", data.a.app.img);
        $(".ui-2#apps .faw-box .faw-featured .faw-title").html(data.a.app.title);
        $(".ui-2#apps .faw-box .faw-featured .faw-href").attr("href", data.a.app.href).css("display", "block");
      }
      if( typeof(data.a.widget) === "object" ) {
        $(".ui-2#widgets .faw-box .faw-featured img").attr("src", data.a.widget.img);
        $(".ui-2#widgets .faw-box .faw-featured .faw-title").html(data.a.widget.title);
        $(".ui-2#widgets .faw-box .faw-featured .faw-href").attr("href", data.a.widget.href).css("display", "block");
      }
    }
  }
  /* END :: Featured */

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
    } else {
      $("#bookmarksBar").css("display", "none");
    }

    if(localStorage.getItem("hide-app-names") === null) {
      localStorage.setItem("hide-app-names", "no");
    }

    if(localStorage.getItem("hide-app-names") === "yes") {
      $("body").addClass("hide-app-names");
    } else {
      $("#toggle-app-names").attr('checked', 'checked');
    }

    if(localStorage.getItem("hide-shortcut-names") === null) {
      localStorage.setItem("hide-shortcut-names", "no");
    }

    if(localStorage.getItem("hide-shortcut-names") === "yes") {
      $("body").addClass("hide-shortcut-names");
    } else {
      $("#toggle-shortcut-names").attr('checked', 'checked');
    }

    if(localStorage.getItem("lock") === "false") {
      $('#unlock-button').trigger('click');
    } else {
      $("body").addClass("locked").removeClass("unlocked");
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

    $("#widget-holder > .app > a").live('mouseup', function(e) {
      if( (this.href).match(amazon_regex) ) {
        if (localStorage["amazon-locale"] !== null
          && localStorage["amazon-locale"] !== ""
          && typeof(localStorage["amazon-locale"]) !== "undefined") {
          this.href = "http://www." + localStorage["amazon-locale"] + "/?tag=sntp-20";
        } else {
          $(this).attr("data-url", "http://www.amazon.com/?tag=sntp-20");
        }
      }

      if( (this.href).indexOf("file://") != -1 ) {
        switch(e.which)
        {
          case 1:
            chrome.tabs.update(null, {url: (this.href)});
            return false;
          break;
          case 2:
            chrome.tabs.create({url: (this.href)});
            return false;
          break;
        }
      }
    }).live('click', function(e) {
      if( (this.href).indexOf("file://") != -1 ) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
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
        $(".bg-color").css('backgroundColor', '#' + hex);
        localStorage.setItem("color-bg", hex);
      }
    });
  });

  $(".bg-color").css('backgroundColor', '#' + (localStorage.getItem("color-bg") || "221f20"));

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

  $("#toggle-app-names").live("click", function(){
    if ($(this).is(':checked')) {
      $("body").removeClass("hide-app-names");
      localStorage.setItem("hide-app-names", "no");
    } else {
      $("body").addClass("hide-app-names");
      localStorage.setItem("hide-app-names", "yes");
    }
  });

  $("#toggle-shortcut-names").live("click", function(){
    if ($(this).is(':checked')) {
      $("body").removeClass("hide-shortcut-names");
      localStorage.setItem("hide-shortcut-names", "no");
    } else {
      $("body").addClass("hide-shortcut-names");
      localStorage.setItem("hide-shortcut-names", "yes");
    }
  });

  $("#bg-img-css").live('keyup', function() {
    $(".bg-color").css("background", "" );
    $(".bg-color").css("background", $(this).val() );

    if($(this).val() === "") {
      $(".bg-color").css('backgroundColor', '#' + (localStorage.getItem("color-bg") || "221f20"));
    }

    localStorage.setItem("bg-img-css", $(this).val() );
  });

  $("#reset-button").live("click", function(){
    var r=confirm("Are you sure you want to reset widget and app placements, stock widget preferences (notepad, coloring, etc.), and coloring preferences? Any customizations will be irrevocably lost.");
    if (r==true) {
      reset();
      reload();
    }
  });

  /* END :: Configure */




