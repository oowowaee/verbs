from rest_framework import viewsets

from .models import VerbUser
from verbs.models import Tense, Infinitive
from .serializers import *
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import list_route
from rest_framework.response import Response

class UserViewSet(viewsets.ReadOnlyModelViewSet):
  """API endpoint for listing infinitives."""
  permission_classes = (IsAuthenticated,)
  queryset = VerbUser.objects.all()
  serializer_class = VerbUserSerializer

  @list_route()
  def tenses(self, request):
    user_id = request.user.id
    queryset = Tense.objects.raw('''
      SELECT T.id, T.tense, T.tense_translation, T.mood, T.mood_translation, (U.verbuser_id IS NOT NULL) AS selected
      FROM verbs_tense T
      LEFT OUTER JOIN users_verbuser_tenses U
      ON T.id = U.tense_id
      AND U.verbuser_id = %s''', [user_id])

    serializer = UserTenseSerializer(queryset, many=True)
    return Response(serializer.data)

  @list_route()
  def infinitives(self, request):
    queryset = Infinitive.objects.all()
    serializer = UserInfinitiveSerializer(queryset, many=True)
    return Response(serializer.data)
