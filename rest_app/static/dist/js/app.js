angular.module('verb', ['ui.router', 'ui.bootstrap', 'ngResource', 'templates', 'verbs.constants', 'verbs.factories', 'verbs.controllers'])

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
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home');
}]);

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
angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("home.html","<h1>Navbar example</h1>\n<p>This example is a quick exercise to illustrate how the default, static and fixed to top navbar work. It includes the responsive CSS and HTML, so it also adapts to your viewport and device.</p>\n<p>To see the difference between static and fixed top navbars, just scroll.</p>\n<p>\n  <a class=\"btn btn-lg btn-primary\" href=\"../../components/#navbar\" role=\"button\">View navbar docs &raquo;</a>\n</p>");
$templateCache.put("index.html","{% load staticfiles %}\n\n<html>\n	<head>\n		<link rel=\"stylesheet\" type=\"text/css\" href=\"{% static \'css/style.css\' %}\" />\n		<script src=\"{% static \'js/vendors.min.js\' %}\" ></script>\n    <script src=\"{% static \'js/app.js\' %}\" ></script>\n	</head>\n	<body ng-app=\"verb\">\n    	<div ui-view></div>\n	</body>\n</html>\n");
$templateCache.put("login.html","<form name=\"loginForm\" novalidate ng-submit=\"login(loginForm)\">\n  <div ng-show=\"invalidLogin\">\n    Username not valid :(\n  </div>\n\n  <label class=\"item item-input\" ng-class=\"{\'has-errors\': loginForm.username.$invalid && loginForm.$submitted, \'no-errors\': loginForm.username.$valid}\">\n    <span class=\"input-label\">Username</span>\n    <input type=\"text\" name=\"username\" ng-model=\"authorization.username\" ng-minlength=\"5\" ng-maxlength=\"20\" required>\n  </label>\n       \n  <div class=\"error-container\" ng-show=\"loginForm.username.$error\" ng-messages=\"loginForm.username.$error\">\n    <div ng-messages-include=\"templates/errors.html\"></div>\n  </div>\n   \n  <label class=\"item item-input\" ng-class=\"{\'has-errors\': loginForm.password.$invalid && loginForm.$submitted, \'no-errors\': loginForm.password.$valid}\">\n    <span class=\"input-label\">Password</span>\n    <input type=\"password\" name=\"password\" ng-model=\"authorization.password\" ng-minlength=\"5\" ng-maxlength=\"20\" required>\n  </label>\n   \n  <div class=\"error-container last-error-container\" ng-show=\"loginForm.password.$error && loginForm.$submitted\" ng-messages=\"loginForm.password.$error\">\n    <div ng-messages-include=\"templates/errors.html\"></div> \n  </div>          \n \n  <button class=\"btn btn-primary\" type=\"submit\">\n    Sign In\n  </button>\n</form>");
$templateCache.put("nav.html","<!-- Static navbar -->\n<nav class=\"navbar navbar-default navbar-static-top\">\n  <div class=\"container\">\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"#\">Verbs</a>\n    </div>\n    <div id=\"navbar\" class=\"navbar-collapse collapse\">\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li class=\"active\"><a href=\"#\">Home</a></li>\n        <li><a href=\"#about\">Practice</a></li>\n        <li><a href=\"#contact\">History</a></li>\n        <li uib-dropdown>\n          <a href=\"#\" uib-dropdown-toggle role=\"button\" aria-haspopup=\"true\" aria-expanded=\"false\">User <span class=\"caret\"></span></a>\n          <ul class=\"dropdown-menu\">\n            <li><a ui-sref=\"app.login\">Login</a></li>\n            <li><a href=\"#\">Logout</a></li>\n            <li role=\"separator\" class=\"divider\"></li>\n            <li><a ui-sref=\"app.tenses\">Set Tenses</a></li>\n            <li><a ui-sref=\"app.verbs\">Set Verbs</a></li>\n          </ul>\n        </li>\n      </ul>\n    </div><!--/.nav-collapse -->\n  </div>\n</nav>\n\n<div class=\"container\">\n  <!-- Main component for a primary marketing message or call to action -->\n  <div class=\"jumbotron\">\n    <div ui-view=\"content\"></div>\n  </div>\n</div> <!-- /container -->");
$templateCache.put("tenses.html","<h3>Set Tenses</h3>\n");
$templateCache.put("verbs.html","<h1>Set Tenses</h1>\n");}]);
angular.module('verbs.constants', [])

.constant('DOMAIN', 'http://127.0.0.1:8000');
angular.module('verbs.factories', ['ngResource'])

.factory('UserFactory', ['$http', '$resource', '$window', 'DOMAIN', function($http, $resource, $window, DOMAIN) {
	return $resource(DOMAIN + '/auth/',
    null,
		{
      'login': {url: DOMAIN + '/api/auth/login/', method: 'POST', interceptor: loginInterceptor()},
		  'logout': {url: DOMAIN + '/api/auth/logout/', method: 'POST', interceptor: logoutInterceptor()}
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