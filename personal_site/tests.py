# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APITestCase, APIRequestFactory
from .api import DogAPI

import hashlib
import json
import random


class DogClassifierTestCase(APITestCase):
    def setUp(self):
        self.c = APIRequestFactory()

    def test_registration_endpoint(self):
        out = self.c.post(
            "/models/dog_class", content_type='image/jpeg')
        view = DogAPI.as_view({'post': 'dog_class'})
        test = view(out, format='json')
        print(test)
