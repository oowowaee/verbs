from rest_framework import serializers
from .models import Infinitive

class InfinitiveSerializer(serializers.ModelSerializer):
	class Meta:
		model = Infinitive