(function() {
  angular.module('verbs.controllers', ['ngMessages'])

  .controller('LoginCtrl', ['$http', '$state', 'UserFactory', function($http, $state, UserFactory) {
    this.authorization = {
        username: '',
        password : ''   
      };  

    this.invalidLogin = false;

    this.login = function(form) {
      if(form.$valid) {
        UserFactory.login({
          'username': this.authorization.username,
          'password': this.authorization.password}, function(res) {
            $state.go('app.home');
          }, function(err) {
            this.invalidLogin = true;
          });
      }
    };
  }])
  .controller('UserTensesController', ['Tenses', 'UserFactory', function(Tenses, UserFactory) {
    this.tenses = Tenses;
    this.totalTenses = Tenses.length;

    this.save = function() {
      UserFactory.setTenses(this.tenses, function(response) {
        console.log(response);
      });
    };
  }]);
})();