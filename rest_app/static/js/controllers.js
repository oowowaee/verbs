angular.module('verbs.controllers', ['ngMessages'])

.controller('LoginCtrl', ['$http', '$scope', '$state', 'UserFactory', function($http, $scope, $state, UserFactory) {
  $scope.authorization = {
      username: '',
      password : ''   
    };  

  $scope.invalidLogin = false;

  $scope.login = function(form) {
    if(form.$valid) {
      UserFactory.login({
        'username': $scope.authorization.username,
        'password': $scope.authorization.password}, function(res) {
          $state.go('app.home');

          //Set header
          //Save to local storage
        }, function(err) {
          $scope.invalidLogin = true;
        });
    }
  };
}]);