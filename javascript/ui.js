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
    hideImportSection();
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

  function resetRecentlyClosedTabs() {
    var recently_closed = JSON.parse(localStorage.getItem("recently_closed")),
      rctm_html = [];
    $("#recently-closed-tabs-menu").empty();

    if(recently_closed !== null) {
      $.each(recently_closed, function(id, tab) {

        var rct_temp  = $("<div></div>").addClass("rctm-item");
        $("<img></img>").appendTo(rct_temp).addClass("rctm-icon")
          .attr({
            "src"   : "chrome://favicon/" + tab.url,
            "height": 16,
            "width" : 16
          });

        $("<a></a>").appendTo(rct_temp).addClass("rctm-link")
          .attr({
            "id"    : id   ,
            "title" : tab.title,
            "href"  : tab.url
          })
          .html( tab.title );
        $("<span></span>").appendTo(rct_temp).html( "<img height='19px' width='19px' src='/images/ui-2/x.png' title='Close'>" )
          .attr("data-rctm-id", id).addClass("rctm-close");

        rctm_html.push( rct_temp );
      });

      rctm_html.push(
        $('<div class="rctm-reset-all" id="rctm_clear_all">' + chrome.i18n.getMessage("rctm_clear_all_text") + '</div>')
      );

      $.each(rctm_html, function(i, e) {
        $(e).appendTo("#recently-closed-tabs-menu");
      });
    }
  }

  $('.rctm-close').live("click", function(e) {
    var recently_closed = JSON.parse(localStorage.getItem("recently_closed"));

    recently_closed.splice( $(e.target).parent().attr("data-rctm-id") , 1);

    localStorage.setItem("recently_closed", JSON.stringify(recently_closed));

    resetRecentlyClosedTabs();
  });

  $('#rctm_clear_all').live("click", function(e) {
    if (confirm(chrome.i18n.getMessage("rctm_clear_all_confirm")))
    {
      localStorage.removeItem("recently_closed");
    }
    resetRecentlyClosedTabs();
  });

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


  function clearShowExportImportForm() {
    $("#import-export-textarea").val('');
    $("#import-export-textarea-div").show();
    $("#import-export-btn-import-run-div").hide();
    unsetImportExportTextareaSelection();
  }

  function clearHideExportImportForm() {
    $("#import-export-textarea").val('');
    $("#import-export-textarea-div").hide();
    $("#import-export-btn-import-run-div").hide();
    unsetImportExportTextareaSelection();
  }

  function hideImportSection() {
    $("#config-contents>div:not(#import-export-contents)").show();
    $("#import-export-contents").hide();
    clearHideExportImportForm();
  }

  function selectImportExportTextarea(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    $("#import-export-textarea").select();
  }

  function setImportExportTextareaSelection() {
    $("#import-export-textarea").bind("focus mousedown mouseup", selectImportExportTextarea);
  }

  function unsetImportExportTextareaSelection() {
    $("#import-export-textarea").unbind("focus mousedown mouseup", selectImportExportTextarea);
  }

  $("#import-export-btn").bind("click", function() {
    $("#config-contents>div:not(#import-export-contents)").slideUp(700);
    $("#import-export-contents").slideDown(700);
  });

  $("#import-export-btn2").bind("click", function() {
    $("#config-contents>div:not(#import-export-contents)").slideDown(700);
    $("#import-export-contents").slideUp(700);
    clearHideExportImportForm();
  });

  $("#import-export-btn-import").bind("click", function() {
    clearShowExportImportForm();
    $("#import-export-btn-import-run-div").show();
  });

  $("#import-export-btn-export").bind("click", function() {
    clearShowExportImportForm();
    var exportDataObj = {};
    var locStor = localStorage;
    for(var i=0, len=locStor.length; i<len; i++) {
      var key = locStor.key(i);
      var value = locStor[key];
      exportDataObj[key] = value;
    }
    var base64str = Base64.encode(JSON.stringify(exportDataObj));
    //
    var dateObj = new Date();
    var fullYearVal = dateObj.getFullYear();
    var monthVal = dateObj.getMonth()+1;
    var dateVal = dateObj.getDate();
    if (dateVal<10) {dateVal='0'+dateVal;}
    if (monthVal<10) {monthVal='0'+monthVal;}
    //
    var resultStr = '[ANTP_EXPORT|' + fullYearVal + '-' + monthVal + '-' + dateVal + '|' + chrome.app.getDetails().version + '|' + base64str + ']';

    var $textArea = $("#import-export-textarea");
    $textArea.val(resultStr);
    $textArea.select();
    setImportExportTextareaSelection();
  });

  $("#import-export-btn-import-run").bind("click", function() {
    var $textArea = $("#import-export-textarea");
    var inputStr = $textArea.val().trim();
    if (inputStr)
    {
      inputStr = inputStr.substring(0, inputStr.length-1);
      var tArr = inputStr.split('|');
      var base64str = tArr[tArr.length-1];
      var exportDataObj = JSON.parse(Base64.decode(base64str));
      var locStor = localStorage;
      for(var key in exportDataObj) {
        locStor.setItem(key, exportDataObj[key]);
      }
      $("#import-export-textarea").val('');
      $.jGrowl("Import complete.", { header: "Import/Export" });
    }
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

