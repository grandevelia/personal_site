# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.conf import settings


class Blog(models.Model):
    text = models.TextField()
    title = models.CharField(max_length=512, default='Untitled Blog Post')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.text
