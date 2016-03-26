from django.db.models import Q

from .models import VerbUser
from .serializers import *
from django.core.exceptions import ObjectDoesNotExist

from common.utils import AnyNotNull
from common.views import DefaultPagination, InfinitivePagination
from verbs.models import Tense, Infinitive

from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import list_route, detail_route
from rest_framework.response import Response
from rest_framework import viewsets, status
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
      queryset = Tense.objects.filter(
                    Q(tense_users__isnull = True) |
                    Q(tense_users__id = user_id),
                    active = True
                    ).annotate(selected = AnyNotNull('tense_users__id')
                    ).order_by('id')

      serializer = UserTenseSerializer(queryset, many=True)
      return Response(serializer.data)
    elif request.method == 'PATCH':
      #Otherwise, extract the id fields from the request data and set the currently logged in user's
      #verb tenses to the ones specified
      try:
        keys = [x['id'] for x in request.data if x['selected']]
        request.user.tenses = Tense.objects.filter(pk__in = keys) 
        try:
          request.user.save()
          response_code = status.HTTP_204_NO_CONTENT     
        except: # pragma: no cover
          response_code = status.HTTP_400_BAD_REQUEST  
          logger.error("Error saving user tenses: user#{0} tenses{1}".format(user_id, keys))
      except: # pragma: no cover
        response_code = status.HTTP_400_BAD_REQUEST  
        logger.error("Error saving user tenses: user#{0} data:{1}".format(user_id, request.data))
      return Response(status=response_code)


  #TODO: Test this route without a pk
  @list_route(methods=['get', 'patch'])
  def infinitive(self, request, infinitive_pk=None):
    try:
      obj = Infinitive.objects.get(pk = infinitive_pk, active = True)

      if request.method == 'PATCH':
        if request.data['selected']:
          request.user.infinitives.add(obj)
        else:
          request.user.infinitives.remove(obj)
        request.user.save

      serializer = UserInfinitiveSerializer(obj)
      return Response(serializer.data)
    except ObjectDoesNotExist:
      if request.method == 'PATCH':
        response_code = status.HTTP_400_BAD_REQUEST    
      else:
        response_code = status.HTTP_404_NOT_FOUND
      return Response(status=response_code)      


  @list_route(pagination_class = InfinitivePagination)
  def infinitives(self, request):
    user_id = request.user.id

    #If this is a get request, pull all the infinitives and annotate them with a boolean field indicating if
    #the currently logged in user has chosen this infinitive
    if request.method == 'GET':
      queryset = Infinitive.objects.filter(
                    Q(infinitive_users__isnull = True) |
                    Q(infinitive_users__id = user_id),
                    active = True
                    ).annotate(selected = AnyNotNull('infinitive_users__id'))

      #We need to manually paginate this, as we're using a custom serializer
      page = self.paginate_queryset(queryset)

      serializer = UserInfinitiveSerializer(page, many=True)
      return self.get_paginated_response(serializer.data)
