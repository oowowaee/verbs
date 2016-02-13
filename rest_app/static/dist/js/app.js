(function() {
  angular.module('verb', ['ui.router', 'ui.bootstrap', 'ngResource', 'templates', 'verbs.filters', 'verbs.constants', 'verbs.factories', 'verbs.controllers'])

  .run(['$rootScope', function($rootScope) {
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
  }])
  .config(['$stateProvider', '$urlRouterProvider', '$resourceProvider', function($stateProvider, $urlRouterProvider, $resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;

    $stateProvider
    .state('app', {
      url: '',
      abstract: true,
      templateUrl: 'nav.html',
      //controller: 'AppCtrl'
    })

    .state('app.home', {
      url: '/home',
      views: {
        'content': {
          templateUrl: 'home.html',
        }
      }
    }).
    state('app.login', {
      url: '/login',
      views: {
        'content': {
          templateUrl: 'login.html',
          controller: 'LoginCtrl',
          controllerAs: 'loginPage'
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
      resolve: {
        Tenses: function(UserFactory) {
          return UserFactory.getTenses().$promise;
        }
      }
    }).
    state('app.infinitives', {
      url: '/infinitives/?page',
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

(function(){angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("errors.html","<script id=\"error-list.html\" type=\"text/ng-template\">  \n  <div class=\"error\" ng-message=\"required\">\n    <i class=\"ion-information-circled\"></i> \n    This field is required!\n  </div>\n  <div class=\"error\" ng-message=\"minlength\">\n    <i class=\"ion-information-circled\"></i> \n    Minimum length of this field is 5 characters!\n  </div>\n  <div class=\"error\" ng-message=\"maxlength\">\n    <i class=\"ion-information-circled\"></i> \n    Maximum length of this field is 20 characters!\n  </div>\n</script>   \n");
$templateCache.put("home.html","<div class=\"jumbotron\">\n	<h1>Navbar example</h1>\n	<p>This example is a quick exercise to illustrate how the default, static and fixed to top navbar work. It includes the responsive CSS and HTML, so it also adapts to your viewport and device.</p>\n	<p>To see the difference between static and fixed top navbars, just scroll.</p>\n	<p>\n	  <a class=\"btn btn-lg btn-primary\" href=\"../../components/#navbar\" role=\"button\">View navbar docs &raquo;</a>\n	</p>\n</div>");
$templateCache.put("infinitives.html","<h3>Set Infinitives</h3>\n\n<div class=\"col-md-4\">\n  <div class=\"checkbox\" ng-repeat=\"i in userInfinitives.infinitives | slice:0:userInfinitives.thirdOfResults track by i.id\">\n    <label>\n    <input type=\"checkbox\" ng-model=\"i.selected\" ng-change=\"userInfinitives.setInfinitive(i.id, i.selected)\"/>\n      &nbsp;&nbsp;{{ i.name }}\n    </label>\n  </div>\n</div>\n<div class=\"col-md-4\">\n  <div class=\"checkbox\" ng-repeat=\"i in userInfinitives.infinitives | slice:userInfinitives.thirdOfResults:userInfinitives.thirdOfResults*2 track by i.id\">\n    <label>\n    <input type=\"checkbox\" ng-model=\"i.selected\" ng-change=\"userInfinitives.setInfinitive(i.id, i.selected)\"/>\n      &nbsp;&nbsp;{{ i.name }}\n    </label>\n  </div>\n</div>\n<div class=\"col-md-4\">\n  <div class=\"checkbox\" ng-repeat=\"i in userInfinitives.infinitives | slice:userInfinitives.thirdOfResults*2:userInfinitives.totalInfinitives track by i.id\">\n    <label>\n    <input type=\"checkbox\" ng-model=\"i.selected\" ng-change=\"userInfinitives.setInfinitive(i.id, i.selected)\"/>\n      &nbsp;&nbsp;{{ i.name }}\n    </label>\n  </div>\n</div>\n\n<div class=\"col-md-12\">\n  <button class=\"btn btn-primary\" ng-if=\"userInfinitives.getPrev\" ng-click=\"userInfinitives.getPrev()\">Prev</button>\n  <button class=\"pull-right btn btn-primary\" ng-if=\"userInfinitives.getNext\" ng-click=\"userInfinitives.getNext()\">Next</button>\n</div>");
$templateCache.put("login.html","<br/>\n<br />\n<form name=\"loginForm\" class=\"form-horizontal col-md-8 col-md-offset-2\" novalidate ng-submit=\"loginPage.login(loginForm)\">\n  <div class=\"text-center\" ng-show=\"loginPage.invalidLogin\">\n    <div class=\"alert alert-danger\">\n      We were unable to log you in with the provided credentials.\n    </div>\n    <br />\n  </div>\n  <div class=\"form-group\">\n    <label for=\"username\" class=\"col-sm-2 control-label\" ng-class=\"{\'has-errors\': loginForm.username.$invalid && loginForm.$submitted, \'no-errors\': loginForm.username.$valid}\">\n      Username\n    </label>\n    <div class=\"col-sm-10\">\n      <input id=\"username\" class=\"form-control\" type=\"text\" name=\"username\" ng-model=\"loginPage.authorization.username\" ng-minlength=\"5\" ng-maxlength=\"20\" required>\n    </div>     \n    <div class=\"error-container\" ng-show=\"loginForm.username.$error\" ng-messages=\"loginForm.username.$error\">\n      <div ng-messages-include=\"errors.html\"></div>\n    </div>\n  </div>\n\n  <div class=\"form-group\">\n    <label for=\"password\" class=\"col-sm-2 control-label\" ng-class=\"{\'has-errors\': loginForm.password.$invalid && loginForm.$submitted, \'no-errors\': loginForm.password.$valid}\">\n      Password\n    </label>\n    <div class=\"col-sm-10\">\n      <input id=\"password\" class=\"form-control\" type=\"password\" name=\"password\" ng-model=\"loginPage.authorization.password\" ng-minlength=\"5\" ng-maxlength=\"20\" required>\n    </div>\n    <div class=\"error-container last-error-container\" ng-show=\"loginForm.password.$error && loginForm.$submitted\" ng-messages=\"loginForm.password.$error\">\n      <div ng-messages-include=\"errors.html\"></div> \n    </div>      \n  </div>    \n\n  <br />\n  <br />\n\n  <div class=\"text-center\">\n    <button class=\"btn btn-primary\" type=\"submit\">\n      Sign In\n    </button>\n  </div>\n</form>");
$templateCache.put("nav.html","<!-- Static navbar -->\n<nav class=\"navbar navbar-default navbar-static-top\">\n  <div class=\"container\">\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"#\">Verbs</a>\n    </div>\n    <div id=\"navbar\" class=\"navbar-collapse collapse\">\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li class=\"active\"><a href=\"#\">Home</a></li>\n        <li><a href=\"#about\">Practice</a></li>\n        <li><a href=\"#contact\">History</a></li>\n        <li uib-dropdown>\n          <a href=\"#\" uib-dropdown-toggle role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">User <span class=\"caret\"></span></a>\n          <ul class=\"dropdown-menu\">\n            <li><a ui-sref=\"app.login\">Login</a></li>\n            <li><a href=\"#\">Logout</a></li>\n            <li role=\"separator\" class=\"divider\"></li>\n            <li><a ui-sref=\"app.tenses\">Set Tenses</a></li>\n            <li><a ui-sref=\"app.infinitives\">Set Verbs</a></li>\n          </ul>\n        </li>\n      </ul>\n    </div><!--/.nav-collapse -->\n  </div>\n</nav>\n\n<div class=\"container\">\n  <!-- Main component for a primary marketing message or call to action -->\n  <div ui-view=\"content\"></div>\n</div> <!-- /container -->");
$templateCache.put("tenses.html","<h3>Set Tenses</h3>\n\n<div class=\"col-md-6\">\n  <div class=\"checkbox\" ng-repeat=\"t in userTenses.tenses | slice:0:userTenses.totalTenses/2 track by t.id\">\n    <label>\n    <input type=\"checkbox\" ng-model=\"t.selected\" />\n      &nbsp;&nbsp;{{ t.translation }}\n    </label>\n  </div>\n</div>\n<div class=\"col-md-6\">\n  <div class=\"checkbox\" ng-repeat=\"t in userTenses.tenses | slice:userTenses.totalTenses/2:userTenses.totalTenses track by t.id\">\n    <label>\n    <input type=\"checkbox\" ng-model=\"t.selected\" />\n      &nbsp;&nbsp;{{ t.translation }}\n    </label>\n  </div>\n</div>\n\n<div class=\"text-center\">\n  <button class=\"btn btn-primary\" ng-click=\"userTenses.save()\">Save</button>\n</div>");}]);})();
angular.module('verbs.constants', [])

.constant('DOMAIN', 'http://127.0.0.1:8000');
(function() {
  angular.module('verbs.factories', ['ngResource'])
        .factory('UserFactory', UserFactory)
        .factory('RandomEndPointFactory', RandomEndPointFactory)
        .factory('ConjugationFactory', ConjugationFactory)
        .factory('GerundFactory', GerundFactory)
        .factory('ParticipleFactory', ParticipleFactory);

   UserFactory.$inject = ['$http', '$resource', '$window', 'DOMAIN'];
   function UserFactory($http, $resource, $window, DOMAIN) {
    return $resource(DOMAIN + '/api/auth/',
      null,
      {
        'login': {url: DOMAIN + '/api/auth/login/', method: 'POST', interceptor: loginInterceptor()},
        'logout': {url: DOMAIN + '/api/auth/logout/', method: 'POST', interceptor: logoutInterceptor()},
        'getTenses': {url: DOMAIN + '/api/user/tenses/', method: 'GET', isArray: true},
        'setTenses': {url: DOMAIN + '/api/user/tenses/', method: 'PATCH'},
        'getInfinitives': {url: DOMAIN + '/api/user/infinitives/?page=:page', params: {page: '@page'}, method: 'GET'},
        'setInfinitive': {url: DOMAIN + '/api/user/infinitive/:pk', params: {pk: '@pk'}, method: 'PATCH'},
      }
    );

    function loginInterceptor() {
      return {
        response: function (response) {
          $http.defaults.headers.common.Authorization = 'Token ' + response.data.auth_token;
          $window.localStorage.token = response.data.auth_token;
        },
        responseError: function (data) {
        }
      };
    }

    function logoutInterceptor() {
      return {
        response: function (data) {
          $http.defaults.headers.common.Authorization = undefined;
          $window.localStorage.token = undefined;
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