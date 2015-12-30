from rest_framework import serializers
from .models import Infinitive, Conjugation

class InfinitiveSerializer(serializers.ModelSerializer):
	class Meta:
		model = Infinitive

class ConjugationSerializer(serializers.ModelSerializer):
	class Meta:
		model = Conjugation

class VerbSerializer(serializers.Serializer):
	pass