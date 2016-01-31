angular.module('verbs.factories', ['ngResource'])

.factory('UserFactory', ['$http', '$resource', '$window', 'DOMAIN', function($http, $resource, $window, DOMAIN) {
	return $resource(DOMAIN + '/auth/',
    null,
		{
      'login': {url: DOMAIN + '/api/auth/login/', method: 'POST', interceptor: loginInterceptor()},
		  'logout': {url: DOMAIN + '/api/auth/logout/', method: 'POST', interceptor: logoutInterceptor()},
      'getTenses': {url: DOMAIN + '/api/user/tenses', method: 'GET'}
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