function i18nCtrl($scope) {
  $scope.i18nMsg = function (messageName) {
      return chrome.i18n.getMessage(messageName);
    }
}
