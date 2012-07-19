var filtersModule = angular.module('antp.filters', []);

// i18n filter to output i18n messages
filtersModule.filter('i18n', function() {
  return function(messageId) {
    // iframes don't have access to chrome.extensions object in manifest V2 so use parent object in iframes
    if (chrome.i18n) {
      return chrome.i18n.getMessage(messageId);
    }
    else {
      return parent.chrome.i18n.getMessage(messageId);
    }
  };
});
