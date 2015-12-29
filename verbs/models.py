from __future__ import unicode_literals

from django.db import models

class Infinitive(models.Model):
	english_name = models.CharField(max_length = 125)
	spanish_name = models.CharField(max_length = 50)
	active = models.BooleanField(default = True)
	from_duolingo = models.BooleanField(default = False)
	top_250 = models.BooleanField(default = False)


class Gerund(models.Model):
	infinitive = models.ForeignKey(Infinitive)
	gerund = models.CharField(max_length = 50) 
	translation = models.CharField(max_length = 125)
