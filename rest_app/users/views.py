from rest_framework import viewsets

from common.views import DefaultPagination, InfinitivePagination
from .models import VerbUser
from verbs.models import Tense, Infinitive
from .serializers import *
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger('verbs')

class UserViewSet(viewsets.ModelViewSet):
  """API endpoint for listing infinitives."""
  permission_classes = (IsAuthenticated,)
  queryset = VerbUser.objects.all()
  serializer_class = VerbUserSerializer
  pagination_class = DefaultPagination

  @list_route(methods=['get', 'patch'])
  def tenses(self, request):
    user_id = request.user.id
    #If this is a get request, pull all the tenses and annotate them with a boolean field indicating if
    #the currently logged in user has chosen this tense
    if request.method == 'GET':
      queryset = Tense.objects.all()

      #TODO consider pagination or caching this?
      serializer = UserTenseSerializer(queryset, many=True, tenses=[x.id for x in request.user.tenses.all().only('id')])
      return Response(serializer.data)
    elif request.method == 'PATCH':
      #Otherwise, extract the id fields from the request data and set the currently logged in user's
      #verb tenses to the ones specified
      keys = [x['id'] for x in request.data if x['selected']]
      request.user.tenses = Tense.objects.filter(pk__in = keys) 
      try:
        request.user.save()
        response_code = status.HTTP_204_NO_CONTENT     
      except: # pragma: no cover
        response_code = status.HTTP_400_BAD_REQUEST  
        logger.error("Error saving user tenses: user#{0} tenses{1}".format(user_id, keys))
      return Response(status=response_code)


  @list_route(methods=['get', 'patch'])
  def infinitive(self, request, pk=None):
    obj = Infinitive.objects.filter(pk = pk)[0]
    if request.method == 'GET':
      serializer = UserInfinitiveSerializer(obj, infinitives=[x.id for x in request.user.infinitives.filter(pk = pk).only('id')])
    elif request.method == 'PATCH':
      if request.data['selected']:
        request.user.infinitives.add(obj)
        request.user.save
        serializer = UserInfinitiveSerializer(obj, infinitives=[pk])
      else:
        request.user.infinitives.remove(obj)
        request.user.save
        serializer = UserInfinitiveSerializer(obj, infinitives=[])
    return Response(serializer.data)


  @list_route(pagination_class = InfinitivePagination)
  def infinitives(self, request):
    user_id = request.user.id

    #If this is a get request, pull all the infinitives and annotate them with a boolean field indicating if
    #the currently logged in user has chosen this infinitive
    if request.method == 'GET':
      queryset = Infinitive.objects.all()

      #We need to manually paginate this, as we're using a custom serializer
      page = self.paginate_queryset(queryset)

      #TODO consider pagination or caching this?
      serializer = UserInfinitiveSerializer(page, many=True, infinitives=[x.id for x in request.user.infinitives.all().only('id')])
      return self.get_paginated_response(serializer.data)
