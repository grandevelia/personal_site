from rest_framework import serializers
from .models import Blog
from django.db import models


class BlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ('id', 'text', 'title', 'created_at')
