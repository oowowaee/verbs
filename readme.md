Running the django server:
	cd django 
	source bin/active
	cd verbs/rest_app
	./manage.py runserver

	http://127.0.0.1:8000/ 			for angular app
	http://127.0.0.1:8000/api/ 		for REST api

Running the Ionic app:

API endpoints (+has been implemented):

api/

	+conjugations/
		Filter by infinitive
		Filter by tense
		Filter by 
		+:id/
		+random/

	+gerunds/
		+random/

	+participles/
		+random/

	verb
		/:id     	
		/history
		*admins need to be able to post edits
		*admins need to be able to create new verbs

	+infinitives/
		+:id/
		*admins need to be able to post, to update the list of active verbs
			/activate?

	/score
		*users need to be able to post scores as well as a list

	+tenses/
		:id/activate?
		*users need to be able to set their tenses and verbs


	(+Added by Djoser)
	auth/
		/me/
		/register/
		/login/ (token based authentication)
		/logout/ (token based authentication)
		/activate/
		/{{ User.USERNAME_FIELD }}/
		/password/
		/password/reset/
		/password/reset/confirm/