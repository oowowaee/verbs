from django.test import TestCase
from users.models import VerbUser
from verbs.models import Tense, Infinitive

from rest_framework.test import APIClient, APITestCase
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.core.urlresolvers import reverse
import json

class BasicModelTestCase(TestCase):
  fixtures = ['verbs/fixtures/short_data.json']

  def test_creating_user_creates_defaults(self):
    '''Set one of the infinitives to inactive, and one to not being from_duolingo.
    Set one of the tenses to false and very they don't get initialized when the user is created'''
    Infinitive.objects.all().update(from_duolingo = True, active = True)
    Tense.objects.all().update(default = True, active = True)

    infinitives = Infinitive.objects.all()
    infinitive_count = infinitives.count()
    i = Infinitive.objects.get(pk = infinitives[0].pk)
    i2 = Infinitive.objects.get(pk = infinitives[1].pk)

    i.active = False
    i.save()
    i2.from_duolingo = False
    i2.save()

    tenses = Tense.objects.all()
    tense_count = Tense.objects.all().count()
    t = Tense.objects.get(pk = tenses[0].pk)

    t.active = False
    t.save()

    self.assertEqual(Infinitive.objects.filter(active = False).count(), 1)
    self.assertEqual(Infinitive.objects.filter(from_duolingo = False).count(), 1)
    self.assertEqual(Tense.objects.filter(active = False).count(), 1)

    user = VerbUser.objects.create(password='1234', username='tallyoh', email='tally@test.com')
    user.save()
    self.assertNotEqual(user.pk, None)
    
    self.assertEqual(user.infinitives.count(), Infinitive.objects.count() - 2)
    self.assertEqual(user.tenses.count(), Tense.objects.count() - 1)


class BasicSerializerTestCase(APITestCase):
  fixtures = ['verbs/fixtures/initial_data.json']

  def setUp(self):
    #Set one of the infinitives and tenses to false to make sure they don't get initialized when the user is created
    Infinitive.objects.all().update(from_duolingo = True, active = True)
    infinitives = Infinitive.objects.filter(from_duolingo = True, active = True)
    
    i = Infinitive.objects.get(pk = infinitives[0].pk)
    i2 = Infinitive.objects.get(pk = infinitives[1].pk)

    i.active = False
    i.save()
    i2.from_duolingo = False
    i2.save()

    self.inactive_infinitive_id = i.pk

    Tense.objects.all().update(default = True, active = True)
    tenses = Tense.objects.all()

    t = Tense.objects.get(pk = tenses[0].pk)
    t.active = False
    t.save()

    self.total_number_of_tenses = tenses.count()
    self.inactive_tense_id = t.pk

    self.user = VerbUser.objects.create(password='1234', username='tallyoh', email='tally@test.com')
    self.user.save()
    self.assertNotEqual(self.user.pk, None)    

    self.client = APIClient()
    token = Token.objects.create(user = self.user)
    self.client = APIClient()
    self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

  def test_user_tense_serializer(self):
    ''' Test when doing a get request that only active tenses are returned.
    Test that the data is serialized appropriately - namely tenses in use by this user have the selected field set to true.'''
    NUMBER_SET_TO_TRUE = 3
    self.user.tenses = Tense.objects.filter(active = True)[:NUMBER_SET_TO_TRUE]
    self.user.save()

    self.assertEqual(self.user.tenses.count(), NUMBER_SET_TO_TRUE)

    url = reverse('user-tenses')
    response = self.client.get(url)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    result = json.loads(response.content)

    self.assertEqual(len(result), Tense.objects.filter(active = True).count())

    for i, r in enumerate(result):
      if i < NUMBER_SET_TO_TRUE:
        self.assertEqual(r['selected'], True)
      else:
        self.assertEqual(r['selected'], False)

  def test_patch_user_tense_serializer(self):
    '''Test that when doing a patch request, the tenses marked as selected are persisted to the db and saved as the user's 
    tense selections.'''
    NUMBER_SET_TO_TRUE = 3
    self.user.tenses = []
    self.user.save()

    self.assertEqual(self.user.tenses.count(), 0)

    url = reverse('user-tenses')
    response = self.client.get(url)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    result = json.loads(response.content)

    for i, r in enumerate(result):
      if i < NUMBER_SET_TO_TRUE:
        r['selected'] = True

    response = self.client.patch(url, result, format='json')
    self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    self.assertEqual(self.user.tenses.count(), NUMBER_SET_TO_TRUE)

  def test_user_can_only_interact_with_active_tenses(self):
    ''' Verify that the user can only see and set active tenses'''

    active_tenses = Tense.objects.filter(active = True)
    self.user.tenses = active_tenses
    self.user.save()

    self.assertEqual(self.user.tenses.count(), self.total_number_of_tenses - 1)

    #Verify get doesn't return the inactive tense
    url = reverse('user-tenses')
    response = self.client.get(url)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    result = json.loads(response.content)

    #Verify we cannot patch to the inactive tense
    request_data = {'id': self.inactive_tense_id, 
                    'selected': True}

    response = self.client.patch(url, request_data, format='json')
    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertEqual(self.user.tenses.count(), active_tenses.count())

  def test_user_can_only_see_active_infinitives(self):
    '''Verify that the only infinitives returned from the get request are active ones.'''
    NUMBER_ACTIVATED = 3

    Infinitive.objects.all().update(active = False)
    ids_to_update = [x.pk for x in Infinitive.objects.all()[:NUMBER_ACTIVATED]]
    Infinitive.objects.filter(pk__in = ids_to_update).update(active = True)
    
    url = reverse('user-infinitives')
    response = self.client.get(url)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    result = json.loads(response.content)
    #We need to remember the pagination headers
    self.assertEqual(len(result['results']), NUMBER_ACTIVATED)

  def test_user_can_only_interact_with_active_infinitives(self):
    ''' Verify that the user can only see and set active tenses'''

    active_infinitives = Infinitive.objects.filter(from_duolingo = True, active = True)
    self.user.infinitives = active_infinitives
    self.user.save()

    #Verify get doesn't return the inactive tense
    url = reverse('user-infinitive')

    #Verify we cannot patch to the inactive tense
    request_data = {'id': self.inactive_infinitive_id, 
                    'selected': True}

    response = self.client.patch(url, request_data, format='json')
    self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    self.assertEqual(self.user.infinitives.count(), active_infinitives.count())

