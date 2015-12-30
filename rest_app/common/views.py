from rest_framework import authentication, permissions
from rest_framework.pagination import PageNumberPagination

class DefaultPagination(PageNumberPagination):
	paginate_by = 10
	paginate_by_param = 'page_size'
	max_paginate_by = 100

class DefaultsMixin(object):
	"""Default settings for view authentication, permissions,
	filtering and pagination."""
	# authentication_classes = (
	# 	authentication.BasicAuthentication,
	# 	authentication.TokenAuthentication,
	# )
	# permission_classes = (
	# 	permissions.IsAuthenticated,
	# )
	pagination_class = DefaultPagination