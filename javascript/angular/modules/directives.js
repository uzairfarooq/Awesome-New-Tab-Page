var directivesModule = angular.module('antp.directives', []);

// i18n directive to iclude i18n messages containing html
filtersModule.directive('i18n', function() {
  return {
  	restrict: 'E', 
  	link: function(scope, element, attrs) {
  		var htmlText = chrome.i18n.getMessage(attrs.messageId);
  		element.html(htmlText);
  	}
  }
});
