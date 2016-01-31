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
