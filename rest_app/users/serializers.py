from rest_framework import serializers
from verbs.models import Infinitive, Tense
from .models import *

class UserInfinitiveSerializer(serializers.ModelSerializer):
	#selected = serializers.SerializerMethodField()
	selected = serializers.BooleanField()

	class Meta:
		model = Infinitive
		fields = ('id', 'name', 'translation', 'from_duolingo', 'top_100', 'selected')

	# def get_selected(self, obj):
	# 	return obj.id in self.infinitives

	# def __init__(self, args, **kwargs):
	# 	infinitives = kwargs.pop('infinitives', None)
	# 	super(UserInfinitiveSerializer, self).__init__(args, **kwargs)
	# 	self.infinitives = infinitives


class UserTenseSerializer(serializers.ModelSerializer):	
	#Corresponds to whether or not an entry currently exists in the database for the user and this tense
	#selected = serializers.SerializerMethodField()
	selected = serializers.BooleanField()


	class Meta:
		model = Tense
		fields = ('id', 'translation', 'selected')

	# def get_selected(self, obj):
	# 	return obj.id in self.tenses

	# def __init__(self, args, **kwargs):
	# 	tenses = kwargs.pop('tenses', None)
	# 	super(UserTenseSerializer, self).__init__(args, **kwargs)
	# 	self.tenses = tenses


class VerbUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = VerbUser
		fields = ('id', 'last_login', 'username', 'first_name', 'last_name', 'email', 'is_staff', 'date_joined', 'vosotros')