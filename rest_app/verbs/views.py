from rest_framework import viewsets
from .models import Infinitive, Conjugation
from .serializers import InfinitiveSerializer
from common.views import DefaultsMixin, DefaultPagination

class InfinitiveViewSet(viewsets.ModelViewSet):
	"""API endpoint for listing infinitives."""
	queryset = Infinitive.objects.all()
	serializer_class = InfinitiveSerializer

class ConjugationViewSet(DefaultsMixin, viewsets.ModelViewSet):
	"""API endpoint for listing infinitives."""
	queryset = Conjugation.objects.all()
	serializer_class = InfinitiveSerializer
