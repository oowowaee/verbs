from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework import mixins, viewsets

NUMBER_OF_QUESTIONS_TO_DISPLAY = 10

class DefaultPagination(PageNumberPagination):
	page_size = 20
	page_size_query_param = 'page_size'
	max_page_size = 100


class DefaultQuestionPagination(DefaultPagination):
	page_size = 10


class ListOrUpdateViewSet(mixins.ListModelMixin,
                          mixins.RetrieveModelMixin,
                          mixins.UpdateModelMixin,
                          viewsets.GenericViewSet):
    pass


class InfinitivePagination(DefaultPagination):
	page_size = 42

class RandomViewMixin(object):
	# For GET Requests
	@list_route(permission_classes=[IsAuthenticated])
	def random(self, request):
		""" Adds a route to a viewset displaying a random list of objects """
		pagination_class = DefaultQuestionPagination

		qs = self.get_queryset().filter(infinitive__infinitive_users = request.user.id).order_by('?')[:NUMBER_OF_QUESTIONS_TO_DISPLAY]

		serializer = self.get_serializer(qs, many=True)

		return Response(serializer.data)


class DefaultsMixin(object):
	""" Default settings for view authentication, permissions, filtering and pagination. """
	permission_classes = (IsAdminUser, )
	pagination_class = DefaultPagination