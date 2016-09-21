"""URL patterns for access through REST API."""
from django.conf.urls import url
from .views import PhotoView

urlpatterns = [
    url(r'photos/(?P<pk>[0-9]+)$', PhotoView.as_view(), name='photo-detail'),
]
