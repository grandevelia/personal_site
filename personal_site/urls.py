from django.urls import include, re_path
from rest_framework import routers
from .api import BlogViewSet, DogAPI

router = routers.DefaultRouter()
router.register(r'blogs', BlogViewSet, basename='blogs')

urlpatterns = [
    re_path(r'^models', DogAPI.as_view({'post': 'dog_class'})),
    re_path(r'^', include(router.urls)),
]
