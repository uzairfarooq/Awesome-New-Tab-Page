var directivesModule = angular.module('antp.directives', []);

// i18n directive to iclude i18n messages containing html
filtersModule.directive('i18n', function() {
  return {
    restrict: 'E', 
    link: function(scope, element, attrs) {
      var htmlText;
      // iframes don't have access to chrome.extensions object in manifest V2 so use parent object in iframes
      if (chrome.i18n) {
        htmlText = chrome.i18n.getMessage(attrs.messageId);
      }
      else {
        htmlText = parent.chrome.i18n.getMessage(attrs.messageId);
      }
      element.html(htmlText);
    }
  }
});
