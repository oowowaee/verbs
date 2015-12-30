from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from .models import Infinitive, Conjugation
from .serializers import InfinitiveSerializer, ConjugationSerializer
from common.views import DefaultsMixin, DefaultPagination

class InfinitiveViewSet(DefaultsMixin, viewsets.ModelViewSet):
	"""API endpoint for listing infinitives."""
	queryset = Infinitive.objects.all()
	serializer_class = InfinitiveSerializer


class ConjugationViewSet(DefaultsMixin, viewsets.ModelViewSet):
	"""API endpoint for listing conjugations."""
	queryset = Conjugation.objects.all()
	serializer_class = ConjugationSerializer

	# For GET Requests
	@list_route()
	def random(self, request):
		""" Returns a list of location objects somehow related to MyObject """
		conjugations = Conjugation.objects.all().order_by('?')[:10]
		serializer = self.get_serializer(conjugations, many=True)

		return Response(serializer.data)