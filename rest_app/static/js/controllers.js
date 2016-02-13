(function() {
  angular.module('verbs.controllers', ['ngMessages'])
          .controller('LoginCtrl', LoginCtrl)
          .controller('UserTensesController', UserTensesController)
          .controller('UserInfinitivesController', UserInfinitivesController);

  LoginCtrl.$inject = ['$http', '$state', 'UserFactory'];
  function LoginCtrl($http, $state, UserFactory) {
    var vm = this;
    vm.authorization = {
        username: '',
        password : ''   
      };  

    vm.invalidLogin = false;
    vm.login = login;

    function login(form) {
      if(form.$valid) {
        UserFactory.login({
          'username': vm.authorization.username,
          'password': vm.authorization.password}, function(res) {
            $state.go('app.home');
          }, function(err) {
            vm.invalidLogin = true;
          });
      }
    }
  }

  UserTensesController.$inject = ['Tenses', 'UserFactory'];
  function UserTensesController(Tenses, UserFactory) {
    var vm = this;
    vm.tenses = Tenses;
    vm.totalTenses = Tenses.length;
    vm.save = save;

    function save() {
      UserFactory.setTenses(vm.tenses, function(response) {
        console.log(response);
      });
    }
  }

  UserInfinitivesController.$inject = ['Infinitives', 'UserFactory', '$state', '$stateParams'];
  function UserInfinitivesController(Infinitives, UserFactory, $state, $stateParams) {
    var vm = this;
    vm.infinitives = Infinitives.results;
    vm.totalInfinitives = vm.infinitives.length;
    vm.getPrev = $stateParams.page > 1 ? getPrev : undefined;
    vm.getNext = getNext;
    vm.setInfinitive = setInfinitive;
    vm.thirdOfResults = Math.ceil(vm.infinitives.length/3);

    function getPrev() {
      $state.go('app.infinitives', {page: +$stateParams.page - 1});
    }

    function getNext() {
      $state.go('app.infinitives', {page: +$stateParams.page + 1});
    }

    function setInfinitive(pk, selected) {
      console.log(selected);
      UserFactory.setInfinitive({pk: pk, selected: selected});
    }
  }
})();