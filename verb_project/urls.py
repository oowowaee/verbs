from django.conf.urls import patterns, include, url
from django.contrib import admin

from verbs.urls import router

urlpatterns = patterns('',
	#url(r'^api/token/', obtain_auth_token, name='api-token'),
	url(r'^api/', include(router.urls)),
)
