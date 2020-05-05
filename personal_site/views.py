# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache
index = never_cache(TemplateView.as_view(template_name='index.html'))
# Create your views here.
