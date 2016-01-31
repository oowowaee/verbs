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

  def test_creating_user_creates_defaults(self):
    user = VerbUser.objects.create(password='1234', username='tallyoh', email='tally@test.com')
    user.save()
    self.assertNotEqual(user.pk, None)

    infinitives = Infinitive.objects.filter(from_duolingo = True)
    tenses = Tense.objects.filter(default = True)

    self.assertEqual(user.infinitives.count(), infinitives.count())
    self.assertEqual(user.tenses.count(), tenses.count())


class BasicSerializerTestCase(APITestCase):
  fixtures = ['verbs/fixtures/initial_data.json']

  def setUp(self):
    self.user = VerbUser.objects.create(password='1234', username='tallyoh', email='tally@test.com')
    self.user.save()
    self.assertNotEqual(self.user.pk, None)    

    self.client = APIClient()
    token = Token.objects.create(user = self.user)
    self.client = APIClient()
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

  def test_user_tense_serializer(self):
    NUMBER_SET_TO_TRUE = 3
    self.user.tenses = Tense.objects.all()[:NUMBER_SET_TO_TRUE]
    self.user.save()

    self.assertEqual(self.user.tenses.count(), NUMBER_SET_TO_TRUE)

    url = reverse('user-tenses')
    response = self.client.get(url)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    result = json.loads(response.content)

    for i, r in enumerate(result):
      if i < NUMBER_SET_TO_TRUE:
        self.assertEqual(r['selected'], True)
      else:
        self.assertEqual(r['selected'], False)



