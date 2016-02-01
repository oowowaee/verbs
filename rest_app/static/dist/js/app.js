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
          controllerAS: 'loginPage'
        }
      }
    }).
    state('app.verbs', {
      url: '/verbs',
      views: {
        'content': {
          templateUrl: 'verbs.html',
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
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');
  }]);
})();
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
$templateCache.put("login.html","<br/>\n<br />\n<form name=\"loginForm\" class=\"form-horizontal col-md-8 col-md-offset-2\" novalidate ng-submit=\"loginPage.login(loginForm)\">\n  <div class=\"text-center\" ng-show=\"loginPage.invalidLogin\">\n    <div class=\"alert alert-danger\">\n      We were unable to log you in with the provided credentials.\n    </div>\n    <br />\n  </div>\n  <div class=\"form-group\">\n    <label for=\"username\" class=\"col-sm-2 control-label\" ng-class=\"{\'has-errors\': loginForm.username.$invalid && loginForm.$submitted, \'no-errors\': loginForm.username.$valid}\">\n      Username\n    </label>\n    <div class=\"col-sm-10\">\n      <input id=\"username\" class=\"form-control\" type=\"text\" name=\"username\" ng-model=\"loginPage.authorization.username\" ng-minlength=\"5\" ng-maxlength=\"20\" required>\n    </div>     \n    <div class=\"error-container\" ng-show=\"loginForm.username.$error\" ng-messages=\"loginForm.username.$error\">\n      <div ng-messages-include=\"errors.html\"></div>\n    </div>\n  </div>\n\n  <div class=\"form-group\">\n    <label for=\"password\" class=\"col-sm-2 control-label\" ng-class=\"{\'has-errors\': loginForm.password.$invalid && loginForm.$submitted, \'no-errors\': loginForm.password.$valid}\">\n      Password\n    </label>\n    <div class=\"col-sm-10\">\n      <input id=\"password\" class=\"form-control\" type=\"password\" name=\"password\" ng-model=\"loginPage.authorization.password\" ng-minlength=\"5\" ng-maxlength=\"20\" required>\n    </div>\n    <div class=\"error-container last-error-container\" ng-show=\"loginForm.password.$error && loginForm.$submitted\" ng-messages=\"loginForm.password.$error\">\n      <div ng-messages-include=\"errors.html\"></div> \n    </div>      \n  </div>    \n\n  <br />\n  <br />\n\n  <div class=\"text-center\">\n    <button class=\"btn btn-primary\" type=\"submit\">\n      Sign In\n    </button>\n  </div>\n</form>");
$templateCache.put("nav.html","<!-- Static navbar -->\n<nav class=\"navbar navbar-default navbar-static-top\">\n  <div class=\"container\">\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"#\">Verbs</a>\n    </div>\n    <div id=\"navbar\" class=\"navbar-collapse collapse\">\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li class=\"active\"><a href=\"#\">Home</a></li>\n        <li><a href=\"#about\">Practice</a></li>\n        <li><a href=\"#contact\">History</a></li>\n        <li uib-dropdown>\n          <a href=\"#\" uib-dropdown-toggle role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">User <span class=\"caret\"></span></a>\n          <ul class=\"dropdown-menu\">\n            <li><a ui-sref=\"app.login\">Login</a></li>\n            <li><a href=\"#\">Logout</a></li>\n            <li role=\"separator\" class=\"divider\"></li>\n            <li><a ui-sref=\"app.tenses\">Set Tenses</a></li>\n            <li><a ui-sref=\"app.verbs\">Set Verbs</a></li>\n          </ul>\n        </li>\n      </ul>\n    </div><!--/.nav-collapse -->\n  </div>\n</nav>\n\n<div class=\"container\">\n  <!-- Main component for a primary marketing message or call to action -->\n  <div ui-view=\"content\"></div>\n</div> <!-- /container -->");
$templateCache.put("tenses.html","<h3>Set Tenses</h3>\n\n<div class=\"col-md-6\">\n  <div class=\"checkbox\" ng-repeat=\"t in userTenses.tenses | slice:0:userTenses.totalTenses/2 track by t.id\">\n    <label>\n    <input type=\"checkbox\" ng-model=\"t.selected\" />\n      &nbsp;&nbsp;{{ t.translation }}\n    </label>\n  </div>\n</div>\n<div class=\"col-md-6\">\n  <div class=\"checkbox\" ng-repeat=\"t in userTenses.tenses | slice:userTenses.totalTenses/2:userTenses.totalTenses track by t.id\">\n    <label>\n    <input type=\"checkbox\" ng-model=\"t.selected\" />\n      &nbsp;&nbsp;{{ t.translation }}\n    </label>\n  </div>\n</div>\n\n<div class=\"text-center\">\n  <button class=\"btn btn-primary\" ng-click=\"userTenses.save()\">Save</button>\n</div>");
$templateCache.put("verbs.html","<h1>Set Tenses</h1>\n");}]);})();
angular.module('verbs.constants', [])

.constant('DOMAIN', 'http://127.0.0.1:8000');
angular.module('verbs.factories', ['ngResource'])

.factory('UserFactory', ['$http', '$resource', '$window', 'DOMAIN', function($http, $resource, $window, DOMAIN) {
  return $resource(DOMAIN + '/auth/',
    null,
    {
      'login': {url: DOMAIN + '/api/auth/login/', method: 'POST', interceptor: loginInterceptor()},
      'logout': {url: DOMAIN + '/api/auth/logout/', method: 'POST', interceptor: logoutInterceptor()},
      'getTenses': {url: DOMAIN + '/api/user/tenses/', method: 'GET', isArray: true},
      'setTenses': {url: DOMAIN + '/api/user/tenses/', method: 'PATCH'}
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
}])

/*
  Augment a resource with a random method.
 */
.factory('RandomEndPointFactory', ['$resource', 'DOMAIN', function($resource, DOMAIN) {
  return function(type) {
    return $resource(DOMAIN + '/api/' + type + '/:id',
      null,
      {
        'random': {url: DOMAIN + '/api/' + type + '/random/', method: 'GET', isArray: true},
      }
    );    
  };
}])

.factory('ConjugationFactory', ['RandomEndPointFactory', function(RandomEndPointFactory) {
  return RandomEndPointFactory('conjugations');
}])

.factory('GerundFactory', ['RandomEndPointFactory', function(RandomEndPointFactory) {
  return RandomEndPointFactory('gerunds');
}])

.factory('ParticipleFactory', ['RandomEndPointFactory', function(RandomEndPointFactory) {
  return RandomEndPointFactory('participles');
}]);