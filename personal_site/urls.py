from django.conf.urls import include, url
from rest_framework import routers
from .api import SnippetViewSet, BlogViewSet, LoginAPI, UserAPI

router = routers.DefaultRouter()
router.register('snippets', SnippetViewSet, base_name='snippets')
router.register('blogs', BlogViewSet, base_name='blogs')

urlpatterns = [
	url(r'^', include(router.urls)),
	url(r'^auth/login/$', LoginAPI.as_view()),
	url(r'^auth/user/$', UserAPI.as_view()),
]