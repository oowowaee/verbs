(function() {
  angular.module('verbs.factories', ['ngResource'])
        .factory('UserFactory', UserFactory)
        .factory('RandomEndPointFactory', RandomEndPointFactory)
        .factory('ConjugationFactory', ConjugationFactory)
        .factory('GerundFactory', GerundFactory)
        .factory('ParticipleFactory', ParticipleFactory);

   UserFactory.$inject = ['$http', '$resource', '$window', 'DOMAIN'];
   function UserFactory($http, $resource, $window, DOMAIN) {
    var User = $resource(DOMAIN + '/api/auth/',
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
    User.loggedIn = false;
    return User;

    function loginInterceptor() {
      return {
        response: function (response) {
          User.loggedIn = true;
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
          User.loggedIn = false;
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