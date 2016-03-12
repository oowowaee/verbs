from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from users import views as userviews 
from verbs import views as verbviews

router = DefaultRouter()
router.register(r'infinitives', verbviews.InfinitiveViewSet)
router.register(r'conjugations', verbviews.ConjugationViewSet)
router.register(r'tenses', verbviews.TenseViewSet)
router.register(r'gerunds', verbviews.GerundViewSet)
router.register(r'participles', verbviews.PastparticipleViewSet)
router.register(r'user', userviews.UserViewSet, base_name='user')

urlpatterns = [
	url(r'^api/auth/', include('djoser.urls.authtoken')),
	url(r'^api/user/infinitive/(?P<infinitive_pk>[0-9]+)$', userviews.UserViewSet.as_view({'patch': 'infinitive'})),
	url(r'^$', TemplateView.as_view(template_name='index.html'), name="home"),
	url(r'^api/', include(router.urls)),
]