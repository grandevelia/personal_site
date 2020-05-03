from django.conf.urls import include, url
from django.views.generic import TemplateView
from personal_site import urls, api

urlpatterns = [
    url(r'^api/', include(urls)),
    url(r'^', TemplateView.as_view(template_name="index.html")),
]
