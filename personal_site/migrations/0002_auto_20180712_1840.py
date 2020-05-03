# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-07-12 23:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('personal_site', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='blog',
            name='related_snippet',
            field=models.ManyToManyField(null=True, related_name='snippets', to='personal_site.Snippet'),
        ),
        migrations.AddField(
            model_name='blog',
            name='title',
            field=models.CharField(default='Untitled Blog Post', max_length=512),
        ),
        migrations.AddField(
            model_name='snippet',
            name='title',
            field=models.CharField(default='Untitled Snippet', max_length=512),
        ),
    ]
