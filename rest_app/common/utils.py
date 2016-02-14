from django.db.models import Aggregate

class AnyNotNull(Aggregate):
  function = 'ANY'
  template = 'true = %(function)s(array_agg(%(expressions)s is not null))'