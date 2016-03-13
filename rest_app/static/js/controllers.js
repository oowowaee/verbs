(function() {
  angular.module('verbs.controllers', ['ngMessages', 'ui-notification'])
          .controller('AppCtrl', AppCtrl)
          .controller('LoginCtrl', LoginCtrl)
          .controller('RegistrationCtrl', RegistrationCtrl)
          .controller('ActivationCtrl', ActivationCtrl)
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
          'password': vm.authorization.password}, 
          function(response) {
            $state.go('app.home');
          }, function(error) {
            vm.invalidLogin = true;
          }
        );
      }
    }
  }

  ProfileCtrl.$inject = ['$state', 'UserFactory', 'Notification'];
  function ProfileCtrl($state, UserFactory, Notification) {
    var vm = this;
    var user = UserFactory.user_information;
    vm.submit = submit;
    vm.userDetails = {
      email: user.email,
      username: user.username,
      vosotros: user.vosotros 
    };  

    function submit(form) {
      if (form.$valid) {
        UserFactory.saveMe(vm.userDetails, 
          function(response) {
            Notification.success('Profile updated.');
          }, function(error) {
            Notification.error('Unable to update profile.');        
          }
        );      
      }
    }
  }

  ActivationCtrl.$inject = ['$state', '$stateParams', 'UserFactory', 'Notification'];
  function ActivationCtrl($state, $stateParams, UserFactory, Notification) {
    var vm = this;

    UserFactory.activate({uid: $stateParams.uid, token: $stateParams.token},
      function(response) {
        $state.go('app.login');
      }, function(error) {
        Notification.error('Unable to activate account.');        
      }
    );
  }

  RegistrationCtrl.$inject = ['$state', 'UserFactory', 'Notification'];
  function RegistrationCtrl($state, UserFactory, Notification) {
    var vm = this;
    vm.submit = submit;
    vm.userDetails = {};  

    function submit(form) {
      if (form.$valid) {
        UserFactory.register(vm.userDetails, function(response) {
          Notification.success('Account created.');
        }, function(error) {
          Notification.error('Unable to create account.');        
        });      
      }
    }
  }

  UserTensesController.$inject = ['Notification', 'Tenses', 'UserFactory'];
  function UserTensesController(Notification, Tenses, UserFactory) {
    var vm = this;
    vm.tenses = Tenses;
    vm.totalTenses = Tenses.length;
    vm.save = save;

    function save() {
      UserFactory.setTenses(vm.tenses, 
        function(response) {
          Notification.success('Tenses updated.');
        }, function(error) {
          Notification.error('Unable to update tenses.');          
        }
      );
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
      UserFactory.setInfinitive({pk: pk, selected: selected},
        function(response) {
           Notification.success('Infinitive updated.');
         }, function(error) {
           Notification.error('Unable to update infinitive.');
         }
      );
    }
  }
})();