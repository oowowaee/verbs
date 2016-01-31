from rest_framework import viewsets

from .models import VerbUser
from verbs.models import Tense, Infinitive
from .serializers import *
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger('verbs')

class UserViewSet(viewsets.ModelViewSet):
  """API endpoint for listing infinitives."""
  permission_classes = (IsAuthenticated,)
  queryset = VerbUser.objects.all()
  serializer_class = VerbUserSerializer

  @list_route(methods=['patch', 'get'])
  def tenses(self, request):
    user_id = request.user.id
    #If this is a get request, pull all the tenses and annotate them with a boolean field indicating if
    #the currently logged in user has chosen this tense
    if request.method == 'GET':
      queryset = Tense.objects.raw('''
        SELECT T.id, T.tense, T.tense_translation, T.mood, T.mood_translation, (U.verbuser_id IS NOT NULL) AS selected
        FROM verbs_tense T
        LEFT OUTER JOIN users_verbuser_tenses U
        ON T.id = U.tense_id
        AND U.verbuser_id = %s
        ORDER BY T.id''', [user_id])

      serializer = UserTenseSerializer(queryset, many=True)
      return Response(serializer.data)
    elif request.method == 'PATCH':
      #Otherwise, extract the id fields from the request data and set the currently logged in user's
      #verb tenses to the ones specified
      keys = [x['id'] for x in request.data if x['selected']]
      request.user.tenses = Tense.objects.filter(pk__in = keys) 
      try:
        request.user.save()
        response_code = status.HTTP_204_NO_CONTENT     
      except:
        response_code = status.HTTP_400_BAD_REQUEST  
        logger.error("Error saving user tenses: user#{0} tenses{1}".format(user_id, keys))
      return Response(status=response_code)

  @list_route()
  def infinitives(self, request):
    queryset = Infinitive.objects.all()
    serializer = UserInfinitiveSerializer(queryset, many=True)
    return Response(serializer.data)
