
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

/*  END  :: Top Left Buttons */


/* Tooltips */

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