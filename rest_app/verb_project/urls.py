from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView
from verbs.urls import router

urlpatterns = patterns('',
	url(r'^api/auth/', include('djoser.urls.authtoken')),
	url(r'^$', TemplateView.as_view(template_name='index.html'), name="home"),
	url(r'^api/', include(router.urls)),
)
