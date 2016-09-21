"""URL patterns for access through REST API."""
from __future__ import unicode_literals
from django.conf.urls import url
from .views import PhotoView, RoverView

urlpatterns = [
    url(r'photos/(?P<pk>[0-9]+)$', PhotoView.as_view(), name='photo-detail'),
    url(r'rovers/(?P<pk>[0-9]+)$', RoverView.as_view(), name='rover-detail'),
]

# /api/rovers/rovername/
# /api/rovers/rovername/photos/photoid

# jump to sol, same rover, same cam ->
#   /api/rovers/rovername/sols/solnum
#   /api/rovers/rovername?sol=X&camera__name=current_cam_name

# jump to different rover, same cam (?) same earth date ->
#   /api/rovers/rovername/earth_date/date
#   /api/rovers/rovername?earth_date=XXXXX&camera__name=current_cam_name
