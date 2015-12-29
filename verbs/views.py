from rest_framework import viewsets
from .models import Infinitive
from .serializers import InfinitiveSerializer

class InfinitiveViewSet(viewsets.ReadOnlyModelViewSet):
	"""API endpoint for listing infinitives."""
	queryset = Infinitive.objects.all()
	serializer_class = InfinitiveSerializer