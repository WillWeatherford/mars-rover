"""Views for returning data vi REST API."""
from rest_framework.generics import RetrieveAPIView
from photos.models import Photo


class PhotoView(RetrieveAPIView):
    """Return photo with associated next, prev and adjacent photos."""

    queryset = Photo.objects.all()
