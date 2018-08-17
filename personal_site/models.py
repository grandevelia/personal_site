# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

class Snippet(models.Model):
	text = models.TextField()
	title = models.CharField(max_length=512, default='Untitled Snippet')
	owner = models.ForeignKey(User, related_name='snippets', on_delete=models.CASCADE, null=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.text

class Blog(models.Model):
	text = models.TextField()
	title = models.CharField(max_length=512, default='Untitled Blog Post')
	owner = models.ForeignKey(User, related_name='blogs', on_delete=models.CASCADE, null=True)
	related_snippet = models.ManyToManyField(Snippet, related_name='blogs')
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.text