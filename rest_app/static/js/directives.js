(function() {
  angular.module('verbs.directives', []).

  directive('inputWithKeyboard', function() {
  var tpl = '<div class="input-with-keyboard form-group"> \
        <input class="input-with-keyboard__input form-control" ng-model="modelVar" type="text" /> \
        <div class="text-center"> \
          <div class="input-with-keyboard__btn-group btn-group text-center"> \
            <a ng-click="updateInput($event)" class="input-with-keyboard__btn btn btn-lg btn-default">á</a> \
            <a ng-click="updateInput($event)" class="input-with-keyboard__btn btn btn-lg btn-default">é</a> \
            <a ng-click="updateInput($event)" class="input-with-keyboard__btn btn btn-lg btn-default">í</a> \
            <a ng-click="updateInput($event)" class="input-with-keyboard__btn btn btn-lg btn-default">ó</a> \
            <a ng-click="updateInput($event)" class="input-with-keyboard__btn btn btn-lg btn-default">ú</a> \
            <a ng-click="updateInput($event)" class="input-with-keyboard__btn btn btn-lg btn-default">ü</a> \
            <a ng-click="updateInput($event)" class="input-with-keyboard__btn btn btn-lg btn-default">ñ</a> \
          </div> \
        </div> \
      </div>';
    return {
      restrict: 'E',
      template: tpl,
      replace: true,
      scope: {
        modelVar: '='
      },
      link: function($scope, element, attrs) {
        var inputElement = element.find('input');
        $scope.updateInput = function(e) {
          $scope.modelVar = $scope.modelVar ? $scope.modelVar + e.target.text : e.target.text; 
        }
      }
    };
  });

})();