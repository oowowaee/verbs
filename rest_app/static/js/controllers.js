(function() {
  angular.module('verbs.controllers', ['ngMessages', 'ui-notification'])
          .controller('AppCtrl', AppCtrl)
          .controller('LoginCtrl', LoginCtrl)
          .controller('ProfileCtrl', ProfileCtrl)
          .controller('UserTensesController', UserTensesController)
          .controller('UserInfinitivesController', UserInfinitivesController);

  AppCtrl.$inject = ['$state', '$scope', 'UserFactory'];
  function AppCtrl($state, $scope, UserFactory) {
    var vm = this;
    vm.user = UserFactory.user_information;
    vm.logout = logout;

    function logout(form) {
      UserFactory.logout();
      $state.go('app.home');
    }    
  }

  LoginCtrl.$inject = ['$state', 'UserFactory'];
  function LoginCtrl($state, UserFactory) {
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
          'password': vm.authorization.password}, function(response) {
            $state.go('app.home');
          }, function(error) {
            vm.invalidLogin = true;
          });
      }
    }
  }

  ProfileCtrl.$inject = ['$state', 'UserFactory'];
  function ProfileCtrl($state, UserFactory) {
    var vm = this;
    var user = UserFactory.user_information;
    vm.submit = submit;
    console.log(user);
    vm.userDetails = {
      email: user.email,
      username: user.username,
      vosotros: user.vosotros 
    };  

    function submit(form) {
      UserFactory.saveMe(vm.userDetails, function(response) {
        Notification.success('Profile updated.');
      });      
    }
  }

  UserTensesController.$inject = ['Notification', 'Tenses', 'UserFactory'];
  function UserTensesController(Notification, Tenses, UserFactory) {
    var vm = this;
    vm.tenses = Tenses;
    vm.totalTenses = Tenses.length;
    vm.save = save;

    function save() {
      UserFactory.setTenses(vm.tenses, function(response) {
        Notification.success('Tenses updated.');
      });
    }
  }

  UserInfinitivesController.$inject = ['Infinitives', 'Notification', 'UserFactory', '$state', '$stateParams'];
  function UserInfinitivesController(Infinitives, Notification, UserFactory, $state, $stateParams) {
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
      Notification.success('Infinitive updated.');
      UserFactory.setInfinitive({pk: pk, selected: selected});
    }
  }
})();