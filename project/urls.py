from django.conf.urls import include, url
from django.views.generic import TemplateView
from personal_site import urls, api, views

urlpatterns = [
    url(r'^api/', include(urls)),
    path('', index, name='index'),
]
