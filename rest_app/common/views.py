from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

class DefaultPagination(PageNumberPagination):
	page_size = 10
	page_size_query_param = 'page_size'
	max_page_size = 100


class DefaultsMixin(object):
	"""Default settings for view authentication, permissions,
	filtering and pagination."""
	permission_classes = (IsAuthenticated,)
	pagination_class = DefaultPagination