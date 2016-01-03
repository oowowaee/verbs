from django.test import TestCase
from users.models import VerbUser
from verbs.models import Tense, Infinitive

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
