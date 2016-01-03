from __future__ import unicode_literals
from django.db import models
from django.contrib.contenttypes.fields import GenericRelation

class Infinitive(models.Model):
  is_reflexive = models.BooleanField(default = False)
  translation = models.CharField(max_length = 125)
  name = models.CharField(max_length = 50)
  active = models.BooleanField(default = True)
  from_duolingo = models.BooleanField(default = False)
  top_100 = models.BooleanField(default = False)
  common_in_la = models.BooleanField(default = False)

  class Meta:
    ordering = ('name',)
    
  def __str__(self):
    return self.name

class Gerund(models.Model):
  histories = GenericRelation('users.History', related_query_name='gerunds')
  infinitive = models.ForeignKey(Infinitive)
  gerund = models.CharField(max_length = 50) 
  translation = models.CharField(max_length = 125)


class Pastparticiple(models.Model):
  histories = GenericRelation('users.History', related_query_name='participles')
  infinitive = models.ForeignKey(Infinitive)
  pastparticiple = models.CharField(max_length = 50) 
  translation = models.CharField(max_length = 50) 


class Tense(models.Model):
  tense = models.CharField(max_length = 50)
  tense_translation = models.CharField(max_length = 50)
  mood = models.CharField(max_length = 50) 
  mood_translation = models.CharField(max_length = 50) 
  default = models.BooleanField(default = False)

  def __str__(self):
    return '{0} {1}'.format(self.tense_translation, self.mood)

  def name(self):
    return self.__str__()

  def translation(self):
    return '{0} {1}'.format(self.tense_translation, self.mood_translation)

class Conjugation(models.Model):
  histories = GenericRelation('users.History', related_query_name='conjugations')
  infinitive = models.ForeignKey(Infinitive)
  tense = models.ForeignKey(Tense)
  irregular = models.BooleanField(default = False)
  form_1s = models.CharField(max_length = 80)
  form_2s = models.CharField(max_length = 80)
  form_3s = models.CharField(max_length = 80)
  form_1p = models.CharField(max_length = 80)
  form_2p = models.CharField(max_length = 80)
  form_3p = models.CharField(max_length = 80)