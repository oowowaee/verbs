from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.decorators import list_route
from rest_framework.response import Response


class DefaultPagination(PageNumberPagination):
	page_size = 10
	page_size_query_param = 'page_size'
	max_page_size = 100

class RandomViewMixin(object):
	# For GET Requests
	@list_route()
	def random(self, request):
		""" Returns a list of location objects somehow related to MyObject """
		qs = self.queryset.order_by('?')[:10]

		serializer = self.get_serializer(qs, many=True)

		return Response(serializer.data)

class DefaultsMixin(object):
	"""Default settings for view authentication, permissions,
	filtering and pagination."""
	permission_classes = (IsAuthenticated,)
	pagination_class = DefaultPagination