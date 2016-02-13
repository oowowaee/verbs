from django.test import TestCase
from users.models import VerbUser
from verbs.models import Tense, Infinitive

from rest_framework.test import APIClient, APITestCase
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.core.urlresolvers import reverse
import json

class BasicModelTestCase(TestCase):
  fixtures = ['verbs/fixtures/initial_data.json']

  def test_random_view_returns_random_list:
  	pass

  def test_gerund_view_returns_only_verbs_for_user:
  	pass

