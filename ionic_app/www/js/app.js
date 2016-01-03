// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'verbs.controllers', 'verbs.factories', 'verbs.constants'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($ionicConfigProvider, $resourceProvider, $stateProvider, $urlRouterProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  $resourceProvider.defaults.stripTrailingSlashes = false;

  $stateProvider

  .state('app', {
    url: '',
    abstract: true,
    templateUrl: 'templates/tabs.html',
  })

  .state('app.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/home.html',
      }
    }
  })

  .state('app.practice', {
    abstract: true,
    url: '/practice',
    views: {
      'tab-practice': {
        templateUrl: 'templates/practice.html'
      }
    }
  })

    .state('app.practice.choices', {
      url: '',
      templateUrl: 'templates/choices.html'
    })

    .state('app.practice.all', {
      url: '/all',
      templateUrl: 'templates/exercise.html',
      controller: 'PracticeCtrl',
    })

  .state('app.login', {
    url: '/login',
    views: {
      'tab-login': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl',
      }
    }
  });
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
