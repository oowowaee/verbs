from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'infinitives', views.InfinitiveViewSet)
router.register(r'conjugations', views.ConjugationViewSet)
router.register(r'tenses', views.TenseViewSet)
router.register(r'gerunds', views.GerundViewSet)
router.register(r'participles', views.PastparticipleViewSet)