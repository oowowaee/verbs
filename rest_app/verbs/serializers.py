from rest_framework import serializers
from .models import Infinitive, Conjugation, Tense, Gerund, Pastparticiple

class InfinitiveSerializer(serializers.ModelSerializer):
	class Meta:
		model = Infinitive
		fields = ('id', 'name', 'translation')


class TenseSerializer(serializers.ModelSerializer):	
	class Meta:
		model = Tense
		fields = ('name', 'translation')


class ConjugationSerializer(serializers.ModelSerializer):
	infinitive = InfinitiveSerializer()
	tense = TenseSerializer()

	class Meta:
		model = Conjugation

class GerundSerializer(serializers.ModelSerializer):
	class Meta:
		model = Gerund

class PastparticipleSerializer(serializers.ModelSerializer):
	class Meta:
		model = Pastparticiple

class VerbSerializer(serializers.Serializer):
	pass