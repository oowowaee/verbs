from django.test import TestCase
from users.models import VerbUser
from verbs.models import Tense, Infinitive, Gerund
from common.views import NUMBER_OF_QUESTIONS_TO_DISPLAY 

from rest_framework.test import APIClient, APITestCase
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.core.urlresolvers import reverse
import json

class BasicModelTestCase(TestCase):
  fixtures = ['verbs/fixtures/initial_data.json']

  def setUp(self):
    self.user = VerbUser.objects.create(password='1234', username='tallyoh', email='tally@test.com')
    self.user.save()
    self.assertNotEqual(self.user.pk, None)    

    self.client = APIClient()
    token = Token.objects.create(user = self.user)
    self.client = APIClient()
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)


  def test_random_gerund_view_returns_only_verbs_for_user(self):
    test_infinitives = Infinitive.objects.all()[:10]
    self.user.infinitives = test_infinitives
    self.user.save

    url = reverse('gerund-random')
    response = self.client.get(url)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    result = json.loads(response.content)

    self.assertEqual(len(result), NUMBER_OF_QUESTIONS_TO_DISPLAY)

    infinitive_ids = [x.pk for x in test_infinitives]

    for r in result:
      self.assertIn(r['infinitive'], infinitive_ids)


  #TODO: Should this be returning a 403?
  def test_permissions_for_routes(self):
    url = reverse('gerund-list')
    response = self.client.get(url)
    self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


  def test_permissions_for_admins(self):
    self.admin_user = VerbUser.objects.create(password='1234', username='tallyohadmin', email='tally+admin@test.com', is_staff=True)
    self.admin_user.save()
    self.assertNotEqual(self.admin_user.pk, None)    

    self.client = APIClient()
    token = Token.objects.create(user = self.admin_user)
    self.client = APIClient()
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

    url = reverse('gerund-list')
    response = self.client.get(url)
    self.assertEqual(response.status_code, status.HTTP_200_OK)


  def test_random_participle_view_returns_only_verbs_for_user(self):
    test_infinitives = Infinitive.objects.all()[:10]
    self.user.infinitives = test_infinitives
    self.user.save

    url = reverse('pastparticiple-random')
    response = self.client.get(url)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    result = json.loads(response.content)

    self.assertEqual(len(result), NUMBER_OF_QUESTIONS_TO_DISPLAY)

    infinitive_ids = [x.pk for x in test_infinitives]

    for r in result:
      self.assertIn(r['infinitive'], infinitive_ids)


