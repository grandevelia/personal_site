from django.urls import include, re_path
from rest_framework import routers
from .api import DogAPI

router = routers.DefaultRouter()

urlpatterns = [
    re_path(r'^models', DogAPI.as_view({'post': 'dog_class'})),
    re_path(r'^', include(router.urls)),
]
