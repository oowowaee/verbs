from rest_framework import viewsets

from .models import Infinitive, Conjugation, Gerund, Pastparticiple
from .serializers import *
from common.views import DefaultsMixin, RandomViewMixin, ListOrUpdateViewSet

class InfinitiveViewSet(DefaultsMixin, viewsets.ModelViewSet):
	"""API endpoint for listing infinitives."""
	queryset = Infinitive.objects.all()
	serializer_class = InfinitiveSerializer


class ConjugationViewSet(DefaultsMixin, RandomViewMixin, viewsets.ModelViewSet):
	"""API endpoint for listing conjugations."""
	queryset = Conjugation.objects.all().select_related('infinitive', 'tense')
	serializer_class = ConjugationSerializer


class GerundViewSet(DefaultsMixin, RandomViewMixin, viewsets.ModelViewSet):
	"""API endpoint for listing infinitives."""
	queryset = Gerund.objects.all().select_related('infinitive')
	serializer_class = GerundSerializer


class PastparticipleViewSet(DefaultsMixin, RandomViewMixin, viewsets.ModelViewSet):
	"""API endpoint for listing infinitives."""
	queryset = Pastparticiple.objects.all().select_related('infinitive')
	serializer_class = PastparticipleSerializer


class TenseViewSet(DefaultsMixin, ListOrUpdateViewSet):
	"""API endpoint for listing infinitives."""
	queryset = Tense.objects.all()
	serializer_class = TenseSerializer