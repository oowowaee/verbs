from rest_framework import serializers
from verbs.models import Infinitive, Tense
from .models import *

class UserInfinitiveSerializer(serializers.ModelSerializer):
	selected = serializers.BooleanField()

	class Meta:
		model = Infinitive
		fields = ('id', 'name', 'translation', 'from_duolingo', 'top_100', 'selected')


class UserTenseSerializer(serializers.ModelSerializer):	
	#Corresponds to whether or not an entry currently exists in the database for the user and this tense
	selected = serializers.BooleanField()

	class Meta:
		model = Tense
		fields = ('id', 'translation', 'selected')


class VerbUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = VerbUser
		fields = ('id', 'last_login', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'date_joined', 'vosotros')