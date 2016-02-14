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
  queryset = Conjugation.objects.select_related('infinitive', 'tense').filter()
  serializer_class = ConjugationSerializer


class GerundViewSet(DefaultsMixin, RandomViewMixin, viewsets.ModelViewSet):
  """API endpoint for listing infinitives."""
  queryset = Gerund.objects.all()
  serializer_class = GerundSerializer

  def get_queryset(self):
    user = self.request.user
    qs = Gerund.objects.select_related('infinitive')
    return qs


class PastparticipleViewSet(DefaultsMixin, RandomViewMixin, viewsets.ModelViewSet):
  """API endpoint for listing infinitives."""
  serializer_class = PastparticipleSerializer
  queryset = Pastparticiple.objects.all()

  def get_queryset(self):
    user = self.request.user
    qs = Pastparticiple.objects.select_related('infinitive')
    return qs


class TenseViewSet(DefaultsMixin, ListOrUpdateViewSet):
  """API endpoint for listing infinitives."""
  queryset = Tense.objects.all()
  serializer_class = TenseSerializer