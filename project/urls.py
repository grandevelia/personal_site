from django.urls import include, re_path
from django.views.generic import TemplateView
from personal_site import urls, api
from personal_site.views import index

from django.urls import path

urlpatterns = [
    re_path(r'^api/', include(urls)),
    re_path('', index, name='index'),
]
