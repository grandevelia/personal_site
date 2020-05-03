# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.apps import AppConfig
from django.conf import settings
import os
from fastai.vision import *


class PredictorConfig(AppConfig):
    path = os.path.join(settings.LEARNERS, 'dog_class')
    dog_classifier = load_learner(path)


class PersonalSiteConfig(AppConfig):
    name = 'personal_site'
