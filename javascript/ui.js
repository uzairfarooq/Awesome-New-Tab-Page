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