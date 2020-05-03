from django.conf.urls import include, url
from rest_framework import routers
from .api import BlogViewSet, DogAPI

router = routers.DefaultRouter()
router.register(r'blogs', BlogViewSet, basename='blogs')

urlpatterns = [
    url(r'^models', DogAPI.as_view({'post': 'dog_class'})),
    url(r'^', include(router.urls)),
]
