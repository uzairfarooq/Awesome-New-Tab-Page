var filtersModule = angular.module('antp.filters', []);

// i18n filter to output i18n messages
filtersModule.filter('i18n', function() {
  return function(messageId) {
    return chrome.i18n.getMessage(messageId);
  };
});
