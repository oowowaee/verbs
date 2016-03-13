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