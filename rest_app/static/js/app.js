(function() {
  angular.module('verb', ['ui.router', 'ui.bootstrap', 'ngResource', 'templates', 'ui-notification', 'verbs.filters', 'verbs.constants', 'verbs.factories', 'verbs.controllers'])
  .run(['$http', '$state', '$window', '$rootScope', 'UserFactory', function($http, $state, $window, $rootScope, UserFactory) {
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
      if (UserFactory.user_information && !UserFactory.user_information.isLoggedIn && $window.localStorage.verb_app !== undefined) {
        console.log($window.localStorage.verb_app);
        UserFactory.loginUser($window.localStorage.verb_app.token);
        angular.extend(UserFactory.user_information, $window.localStorage.verb_app.user);
      } 

      if (toState.requiresLogin && (!UserFactory.user_information || !UserFactory.user_information.isLoggedIn)) {
        event.preventDefault();
        $state.go('app.login');
      }
    });
  }])

  .config(['$stateProvider', '$urlRouterProvider', '$resourceProvider', 'NotificationProvider', function($stateProvider, $urlRouterProvider, $resourceProvider, NotificationProvider) {
    NotificationProvider.setOptions({
      delay: 4000,
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