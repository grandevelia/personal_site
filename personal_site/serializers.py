from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Snippet, Blog
from django.contrib.auth.models import User
from django.db import models

class SnippetSerializer(serializers.ModelSerializer):
	class Meta:
		model = Snippet
		fields=('id','text','title','created_at')

class BlogSerializer(serializers.ModelSerializer):
	class Meta:
		model = Blog
		fields=('id','text','title','created_at')

class CreateUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id', 'username', 'password')
		extra_kwargs = {'password': {'write_only':True}}

	def create(self, data):
		user = User.objects.create_user(username=data['username'], email=None, password=data['password'])
		user.save()
		return user

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id', 'username')

class LoginUserSerializer(serializers.Serializer):
	username = serializers.CharField()
	password = serializers.CharField()

	def validate(self, data):
		user = authenticate(**data)
		if not user:
			raise serializers.ValidationError("Unable to log in with provided credentials")
		return user