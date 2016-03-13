(function() {
  angular.module('verb', ['ui.router', 'ui.bootstrap', 'ngResource', 'templates', 'ui-notification', 'LocalStorageModule', 'verbs.filters', 'verbs.constants', 'verbs.factories', 'verbs.controllers'])
  .run(['$http', '$state', '$rootScope', 'localStorageService', 'UserFactory', function($http, $state, $rootScope, localStorageService, UserFactory) {
    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
      console.log('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',toState, toParams);
    });

    $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
      console.log('$stateChangeError - fired when an error occurs during transition.');
      console.log(arguments);
    });

    $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
      console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
    });

    $rootScope.$on('$viewContentLoaded',function(event){
      console.log('$viewContentLoaded - fired after dom rendered',event);
    });

    $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
      console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
      console.log(unfoundState, fromState, fromParams);
    });

    /*
      On route resolve, if the route is marked as requiring login check if the user is logged in, or if the auth token
      exists in localStorage.  If it does, log the user in, otherwise redirect to the loginpage.
     */
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
      var token = localStorageService.get('token');
      var user_information = localStorageService.get('user_information');

      //If we have the information stored locally, then use that to log the user in
      if (UserFactory.user_information && !UserFactory.user_information.isLoggedIn && token !== null) {
        UserFactory.loginUser(token);
        angular.extend(UserFactory.user_information, user_information);
      } 

      if (toState.requiresLogin && (!UserFactory.user_information || !UserFactory.user_information.isLoggedIn)) {
        event.preventDefault();
        $state.go('app.login');
      }
    });
  }])

  .config(['$stateProvider', '$urlRouterProvider', '$resourceProvider', 'NotificationProvider', 'localStorageServiceProvider', function($stateProvider, $urlRouterProvider, $resourceProvider, NotificationProvider, localStorageServiceProvider) {

    //Default storage is localstorage
    localStorageServiceProvider.setPrefix('verb_app');

    NotificationProvider.setOptions({
      delay: 3500,
      startTop: 20,
      startRight: 10,
      verticalSpacing: 20,
      horizontalSpacing: 20,
      replaceMessage: true,
      positionX: 'right',
      positionY: 'bottom'
    });

    $resourceProvider.defaults.stripTrailingSlashes = false;

    $stateProvider
    .state('app', {
      url: '',
      abstract: true,
      templateUrl: 'nav.html',
      controller: 'AppCtrl',
      controllerAs: 'UserCtrl'
    })

    .state('app.home', {
      url: '/home',
      requiresLogin: false,
      views: {
        'content': {
          templateUrl: 'home.html',
        }
      }
    }).
    state('app.login', {
      url: '/login',
      requiresLogin: false,
      views: {
        'content': {
          templateUrl: 'login.html',
          controller: 'LoginCtrl',
          controllerAs: 'loginPage'
        }
      }
    }).
    state('app.profile', {
      url: '/profile',
      requiresLogin: true,
      views: {
        'content': {
          templateUrl: 'profile.html',
          controller: 'ProfileCtrl',
          controllerAs: 'profilePage'
        }
      }
    }).
    state('app.register', {
      url: '/register',
      views: {
        'content': {
          templateUrl: 'register.html',
          controller: 'RegistrationCtrl',
          controllerAs: 'registrationPage'
        }
      }
    }).
    state('app.activate', {
      url: '/activate/:uid/:token',
      views: {
        'content': {
          templateUrl: 'activate.html',
          controller: 'ActivationCtrl',
          controllerAs: 'activationPage'
        }
      }
    }).
    state('app.tenses', {
      url: '/tenses',
      views: {
        'content': {
          templateUrl: 'tenses.html',
          controller: 'UserTensesController',
          controllerAs: 'userTenses'
        }
      },
      requiresLogin: true,
      resolve: {
        Tenses: function(UserFactory) {
          return UserFactory.getTenses().$promise;
        }
      }
    }).
    state('app.infinitives', {
      url: '/infinitives/?page',
      requiresLogin: true,
      views: {
        'content': {
          templateUrl: 'infinitives.html',
          controller: 'UserInfinitivesController',
          controllerAs: 'userInfinitives'
        }
      },
      resolve: {
        Infinitives: function(UserFactory, $stateParams) {
          return UserFactory.getInfinitives({page: $stateParams.page}).$promise;
        }
      },
      params: {
        'page': '1',
      }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');
  }]);
})();
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
(function() {
	// Angular `slice` filter for arrays
	/* http://jsfiddle.net/binarymuse/vquss/ */

	var app = angular.module('verbs.filters', []);

	app.filter('slice', function() {
	  return function(arr, start, end) {
	    return arr.slice(start, end);
	  };
	});

	app.controller('MainController', function($scope) {
	  $scope.items = [];
	  for (var i = 0; i < 100; i++) $scope.items.push(i);
	});
})();

(function(){angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("activate.html","<br/>\n<br />\nActivating account");
$templateCache.put("errors.html","<script id=\"error-list.html\" type=\"text/ng-template\">  \n  <div class=\"error\" ng-message=\"required\">\n    <i class=\"ion-information-circled\"></i> \n    This field is required!\n  </div>\n  <div class=\"error\" ng-message=\"minlength\">\n    <i class=\"ion-information-circled\"></i> \n    Minimum length of this field is 5 characters!\n  </div>\n  <div class=\"error\" ng-message=\"maxlength\">\n    <i class=\"ion-information-circled\"></i> \n    Maximum length of this field is 20 characters!\n  </div>\n</script>   \n");
$templateCache.put("home.html","<div class=\"jumbotron\">\n	<h1>Navbar example</h1>\n	<p>This example is a quick exercise to illustrate how the default, static and fixed to top navbar work. It includes the responsive CSS and HTML, so it also adapts to your viewport and device.</p>\n	<p>To see the difference between static and fixed top navbars, just scroll.</p>\n	<p>\n	  <a class=\"btn btn-lg btn-primary\" href=\"../../components/#navbar\" role=\"button\">View navbar docs &raquo;</a>\n	</p>\n</div>");
$templateCache.put("infinitives.html","<h3>Set Infinitives</h3>\n\n<div class=\"col-md-4\">\n  <div class=\"checkbox\" ng-repeat=\"i in userInfinitives.infinitives | slice:0:userInfinitives.thirdOfResults track by i.id\">\n    <label>\n    <input type=\"checkbox\" ng-model=\"i.selected\" ng-change=\"userInfinitives.setInfinitive(i.id, i.selected)\"/>\n      &nbsp;&nbsp;{{ i.name }}\n    </label>\n  </div>\n</div>\n<div class=\"col-md-4\">\n  <div class=\"checkbox\" ng-repeat=\"i in userInfinitives.infinitives | slice:userInfinitives.thirdOfResults:userInfinitives.thirdOfResults*2 track by i.id\">\n    <label>\n    <input type=\"checkbox\" ng-model=\"i.selected\" ng-change=\"userInfinitives.setInfinitive(i.id, i.selected)\"/>\n      &nbsp;&nbsp;{{ i.name }}\n    </label>\n  </div>\n</div>\n<div class=\"col-md-4\">\n  <div class=\"checkbox\" ng-repeat=\"i in userInfinitives.infinitives | slice:userInfinitives.thirdOfResults*2:userInfinitives.totalInfinitives track by i.id\">\n    <label>\n    <input type=\"checkbox\" ng-model=\"i.selected\" ng-change=\"userInfinitives.setInfinitive(i.id, i.selected)\"/>\n      &nbsp;&nbsp;{{ i.name }}\n    </label>\n  </div>\n</div>\n\n<div class=\"col-md-12\">\n  <button class=\"btn btn-primary\" ng-if=\"userInfinitives.getPrev\" ng-click=\"userInfinitives.getPrev()\">Prev</button>\n  <button class=\"pull-right btn btn-primary\" ng-if=\"userInfinitives.getNext\" ng-click=\"userInfinitives.getNext()\">Next</button>\n</div>");
$templateCache.put("login.html","<br/>\n<br />\n<form name=\"loginForm\" class=\"form-horizontal col-md-8 col-md-offset-2\" novalidate ng-submit=\"loginPage.login(loginForm)\">\n  <div class=\"text-center\" ng-show=\"loginPage.invalidLogin\">\n    <div class=\"alert alert-danger\">\n      We were unable to log you in with the provided credentials.\n    </div>\n    <br />\n  </div>\n  <div class=\"form-group\">\n    <label for=\"username\" class=\"col-sm-2 control-label\" ng-class=\"{\'has-errors\': loginForm.username.$invalid && loginForm.$submitted, \'no-errors\': loginForm.username.$valid}\">\n      Username\n    </label>\n    <div class=\"col-sm-10\">\n      <input id=\"username\" class=\"form-control\" type=\"text\" name=\"username\" ng-model=\"loginPage.authorization.username\" ng-minlength=\"5\" ng-maxlength=\"20\" required>\n    </div>     \n    <div class=\"error-container\" ng-show=\"loginForm.username.$error\" ng-messages=\"loginForm.username.$error\">\n      <div ng-messages-include=\"errors.html\"></div>\n    </div>\n  </div>\n\n  <div class=\"form-group\">\n    <label for=\"password\" class=\"col-sm-2 control-label\" ng-class=\"{\'has-errors\': loginForm.password.$invalid && loginForm.$submitted, \'no-errors\': loginForm.password.$valid}\">\n      Password\n    </label>\n    <div class=\"col-sm-10\">\n      <input id=\"password\" class=\"form-control\" type=\"password\" name=\"password\" ng-model=\"loginPage.authorization.password\" ng-minlength=\"5\" ng-maxlength=\"20\" required>\n    </div>\n    <div class=\"error-container last-error-container\" ng-show=\"loginForm.password.$error && loginForm.$submitted\" ng-messages=\"loginForm.password.$error\">\n      <div ng-messages-include=\"errors.html\"></div> \n    </div>      \n  </div>    \n\n  <br />\n  <br />\n\n  <div class=\"text-center\">\n    <button class=\"btn btn-primary\" type=\"submit\">\n      Sign In\n    </button>\n  </div>\n</form>");
$templateCache.put("nav.html","<!-- Static navbar -->\n<nav class=\"navbar navbar-default navbar-static-top\">\n  <div class=\"container\">\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"#\">Verbs</a>\n    </div>\n    <div id=\"navbar\" class=\"navbar-collapse collapse\">\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li class=\"active\"><a href=\"#\">Home</a></li>\n        <li uib-dropdown ng-show=\"UserCtrl.user.isLoggedIn\">\n          <a href=\"#\" uib-dropdown-toggle role=\"button\">Practice <span class=\"caret\"></span></a>\n          <ul class=\"dropdown-menu\">\n            <li><a>Conjugations</a></li>\n            <li><a>Gerunds</a></li>\n            <li><a>Participles</a></li>\n            <li><a>Drill</a></li>\n          </ul>\n        </li>\n        <li ng-show=\"UserCtrl.user.isLoggedIn\"><a href=\"#contact\">History</a></li>\n        <li uib-dropdown>\n          <a href=\"#\" uib-dropdown-toggle role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">User <span class=\"caret\"></span></a>\n          <ul class=\"dropdown-menu\">\n            <li ng-show=\"!UserCtrl.user.isLoggedIn\"><a ui-sref=\"app.login\">Login</a></li>\n            <li ng-show=\"!UserCtrl.user.isLoggedIn\"><a ui-sref=\"app.register\">Register</a></li>\n            <li ng-show=\"UserCtrl.user.isLoggedIn\"><a ui-sref=\"app.profile\">Profile</a></li>\n            <li ng-show=\"UserCtrl.user.isLoggedIn\"><a ng-click=\"UserCtrl.logout()\" href=\"#\">Logout</a></li>\n            <li ng-show=\"UserCtrl.user.isLoggedIn\" role=\"separator\" class=\"divider\"></li>\n            <li ng-show=\"UserCtrl.user.isLoggedIn\"><a ui-sref=\"app.tenses\">Set Tenses</a></li>\n            <li ng-show=\"UserCtrl.user.isLoggedIn\"><a ui-sref=\"app.infinitives\">Set Verbs</a></li>\n          </ul>\n        </li>\n      </ul>\n    </div><!--/.nav-collapse -->\n  </div>\n</nav>\n\n<div class=\"container\">\n  <!-- Main component for a primary marketing message or call to action -->\n  <div ui-view=\"content\"></div>\n</div> <!-- /container -->");
$templateCache.put("profile.html","<br/>\n<br />\n<form name=\"profileForm\" class=\"form-horizontal col-md-8 col-md-offset-2\" novalidate ng-submit=\"profilePage.submit(profileForm)\">\n  <div class=\"form-group\">\n    <div class=\"checkbox pull-right\">\n      <label>\n        <input type=\"checkbox\" ng-model=\"profilePage.userDetails.vosotros\" />\n        &nbsp;&nbsp;Vosotros\n      </label>\n    </div>\n  </div>\n\n  <div class=\"form-group\">\n    <label for=\"username\" class=\"col-sm-2 control-label\">\n      Username\n    </label>\n    <div class=\"col-sm-10\">\n      <input id=\"username\" disabled class=\"form-control\" type=\"text\" ng-model=\"profilePage.userDetails.username\">\n    </div>     \n  </div>\n\n  <div class=\"form-group\">\n    <label for=\"email\" class=\"col-sm-2 control-label\">\n      Email\n    </label>\n    <div class=\"col-sm-10\">\n      <input id=\"email\" class=\"form-control\" type=\"email\" name=\"email\" ng-model=\"profilePage.userDetails.email\" ng-minlength=\"5\" ng-maxlength=\"20\" required>\n    </div>\n    <div class=\"col-sm-10 pull-right error-message\" ng-show=\"profileForm.email.$touched || profileForm.$submitted\" ng-messages=\"profileForm.email.$error\">\n      <span ng-message=\"email\">\n        A valid email is required!\n      </span>\n      <span ng-message=\"required\">\n        This field is required!\n      </span>    \n    </div>      \n  </div>    \n\n  <br />\n  <br />\n\n  <div class=\"text-center\">\n    <button class=\"btn btn-primary\" type=\"submit\">\n      Save\n    </button>\n  </div>\n</form>");
$templateCache.put("register.html","<br/>\n<br />\n<form name=\"registrationForm\" class=\"form-horizontal col-md-8 col-md-offset-2\" novalidate ng-submit=\"registrationPage.submit(registrationForm)\">\n  <div class=\"form-group\">\n    <label for=\"username\" class=\"col-sm-2 control-label\">\n      Username\n    </label>\n    <div class=\"col-sm-10\">\n      <input id=\"username\" type=\"text\" name=\"username\" class=\"form-control\" type=\"text\" ng-model=\"registrationPage.userDetails.username\">\n    </div>     \n    <div class=\"col-sm-10 pull-right error-message\" ng-show=\"registrationForm.username.$touched || registrationForm.$submitted\" ng-messages=\"registrationForm.username.$error\">    \n      <span ng-message=\"required\">\n        This field is required!\n      </span>    \n    </div>      \n  </div>\n\n  <div class=\"form-group\">\n    <label for=\"email\" class=\"col-sm-2 control-label\">\n      Email\n    </label>\n    <div class=\"col-sm-10\">\n      <input id=\"email\" class=\"form-control\" type=\"email\" name=\"email\" ng-model=\"registrationPage.userDetails.email\" ng-minlength=\"5\" ng-maxlength=\"20\" required>\n    </div>\n    <div class=\"col-sm-10 pull-right error-message\" ng-show=\"registrationForm.email.$touched || registrationForm.$submitted\" ng-messages=\"registrationForm.email.$error\">\n      <span ng-message=\"email\">\n        A valid email is required!\n      </span>\n      <span ng-message=\"required\">\n        This field is required!\n      </span>    \n    </div>      \n  </div>    \n\n  <div class=\"form-group\">\n    <label for=\"password\" class=\"col-sm-2 control-label\">\n      Password\n    </label>\n    <div class=\"col-sm-10\">\n      <input id=\"password\" class=\"form-control\" type=\"password\" name=\"password\" ng-model=\"registrationPage.userDetails.password\" ng-minlength=\"5\" ng-maxlength=\"20\" required>\n    </div>\n    <div class=\"col-sm-10 pull-right error-message\" ng-show=\"registrationForm.password.$touched || registrationForm.$submitted\" ng-messages=\"registrationForm.password.$error\">\n      <span ng-message=\"required\">\n        This field is required!\n      </span>    \n    </div>      \n  </div>    \n\n  <div class=\"form-group\">\n    <label for=\"password_confirmation\" class=\"col-sm-2 control-label\">\n      Confirm Password\n    </label>\n    <div class=\"col-sm-10\">\n      <input id=\"password_confirmation\" class=\"form-control\" type=\"password\" name=\"password_confirmation\" ng-model=\"registrationPage.userDetails.password_confirmation\" ng-minlength=\"5\" ng-maxlength=\"20\" required>\n    </div>\n    <div class=\"col-sm-10 pull-right error-message\" ng-show=\"registrationForm.password_confirmation.$touched || registrationForm.$submitted\" ng-messages=\"registrationForm.password_confirmation.$error\">    \n      <span ng-message=\"required\">\n        This field is required!\n      </span>    \n    </div>      \n  </div>    \n\n  <br />\n  <br />\n\n  <div class=\"text-center\">\n    <button class=\"btn btn-primary\" type=\"submit\">\n      Save\n    </button>\n  </div>\n</form>");
$templateCache.put("tenses.html","<h3>Set Tenses</h3>\n\n<div class=\"col-md-6\">\n  <div class=\"checkbox\" ng-repeat=\"t in userTenses.tenses | slice:0:userTenses.totalTenses/2 track by t.id\">\n    <label>\n    <input type=\"checkbox\" ng-model=\"t.selected\" />\n      &nbsp;&nbsp;{{ t.translation }}\n    </label>\n  </div>\n</div>\n<div class=\"col-md-6\">\n  <div class=\"checkbox\" ng-repeat=\"t in userTenses.tenses | slice:userTenses.totalTenses/2:userTenses.totalTenses track by t.id\">\n    <label>\n    <input type=\"checkbox\" ng-model=\"t.selected\" />\n      &nbsp;&nbsp;{{ t.translation }}\n    </label>\n  </div>\n</div>\n\n<div class=\"text-center\">\n  <button class=\"btn btn-primary\" ng-click=\"userTenses.save()\">Save</button>\n</div>");}]);})();
angular.module('verbs.constants', [])

.constant('DOMAIN', 'http://127.0.0.1:8000');
(function() {
  angular.module('verbs.factories', ['ngResource', 'ui-notification', 'LocalStorageModule'])
        .factory('UserFactory', UserFactory)
        .factory('RandomEndPointFactory', RandomEndPointFactory)
        .factory('ConjugationFactory', ConjugationFactory)
        .factory('GerundFactory', GerundFactory)
        .factory('ParticipleFactory', ParticipleFactory);

  UserFactory.$inject = ['$http', '$resource', 'DOMAIN', 'Notification', 'localStorageService'];
  function UserFactory($http, $resource, DOMAIN, Notification, localStorageService) {
    var User = $resource(DOMAIN + '/api/auth/',
      null,
      {
        'login': {url: DOMAIN + '/api/auth/login/', method: 'POST', interceptor: loginInterceptor()},
        'logout': {url: DOMAIN + '/api/auth/logout/', method: 'POST', interceptor: logoutInterceptor()},
        'activate': {url: DOMAIN + '/api/auth/activate/', method: 'POST'},
        'register': {url: DOMAIN + '/api/auth/register/', method: 'POST'},
        'me': {url: DOMAIN + '/api/auth/me/', method: 'GET', interceptor: userInterceptor()},
        'saveMe': {url: DOMAIN + '/api/auth/me/', method: 'PUT', interceptor: userInterceptor()},
        'getTenses': {url: DOMAIN + '/api/user/tenses/', method: 'GET', isArray: true},
        'setTenses': {url: DOMAIN + '/api/user/tenses/', method: 'PATCH'},
        'getInfinitives': {url: DOMAIN + '/api/user/infinitives/?page=:page', params: {page: '@page'}, method: 'GET'},
        'setInfinitive': {url: DOMAIN + '/api/user/infinitive/:pk', params: {pk: '@pk'}, method: 'PATCH'},
      }
    );
    User.user_information = { isLoggedIn: false };
    User.loginUser = loginUser;
    User.logoutUser = logoutUser;
    return User;

    /*
      If the authtoken is set, mark the user as logged in and try to save the token to localstorage.  Pull the user information if it doesn't exist. 
     */
    function loginUser(token) {
      if (token !== undefined) {
        User.user_information.isLoggedIn = true;
        $http.defaults.headers.common.Authorization = 'Token ' + token;
        localStorageService.set('token', token);
        if (User.user_information.username === undefined) {
          User.me();
        }
      }
    }

    function logoutUser() {
      User.user_information.isLoggedIn = false;
      $http.defaults.headers.common.Authorization = undefined;
      localStorageService.clearAll();
    }

    function updateUserInformation(data) {
      angular.extend(User.user_information, data);
      localStorageService.set('user_information', data);
    }

    function loginInterceptor() {
      return {
        response: function (response) {
          Notification.success('You are now logged in.');
          loginUser(response.data.auth_token);
        },
        responseError: function (data) {
        }
      };
    }

    function logoutInterceptor() {
      return {
        response: function (data) {
          Notification.success('You are now logged out.');
          logoutUser();
        },
        responseError: function (data) {
        }
      };
    }

    function userInterceptor() {
      return {
        response: function (response) {
          updateUserInformation(response.data);
        },
        responseError: function (data) {
        }
      };      
    }
  }

  /*
    Augment a resource with a random method.
   */
  RandomEndPointFactory.$inject = ['$resource', 'DOMAIN'];
  function RandomEndPointFactory($resource, DOMAIN) {
    return function(type) {
      return $resource(DOMAIN + '/api/' + type + '/:id',
        null,
        {
          'random': {url: DOMAIN + '/api/' + type + '/random/', method: 'GET', isArray: true},
        }
      );    
    };
  }

  ConjugationFactory.$inject = ['RandomEndPointFactory'];
  function ConjugationFactory(RandomEndPointFactory) {
    return RandomEndPointFactory('conjugations');
  }

  GerundFactory.$inject = ['RandomEndPointFactory'];
  function GerundFactory(RandomEndPointFactory) {
    return RandomEndPointFactory('gerunds');
  }

  ParticipleFactory.$inject = ['RandomEndPointFactory'];
  function ParticipleFactory(RandomEndPointFactory) {
    return RandomEndPointFactory('participles');
  }
})();