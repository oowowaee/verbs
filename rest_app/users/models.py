from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class VerbUser(AbstractUser):
  vosotros = models.BooleanField(default = True)

class History(models.Model):
  content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
  object_id = models.PositiveIntegerField()
  content_object = GenericForeignKey()
  user = models.ForeignKey(VerbUser, related_query_name='histories')
  added = models.DateField(auto_now_add=True)
  last_practiced = models.DateField(auto_now=True)
  times_correct = models.PositiveIntegerField()
  times_incorrect = models.PositiveIntegerField() 

