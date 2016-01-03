angular.module('verbs.factories', ['ngResource'])

.factory('UserFactory', function($resource, DOMAIN) {
	return $resource(DOMAIN + '/auth/',
    null,
		{
      'login': { url: DOMAIN + '/api/auth/login/', method: 'POST'},
		  'logout': { url: DOMAIN + '/api/auth/logout/', method: 'POST'}
    });
})

.factory('ConjugationFactory', function($resource, DOMAIN) {
	return $resource(DOMAIN + '/api/conjugation/:id',
    null,
  	{
      'random': { url: DOMAIN + '/api/conjugation/random/', method: 'GET'},
    });
});