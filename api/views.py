"""Views for returning data vi REST API."""
from __future__ import unicode_literals
from rest_framework.generics import RetrieveAPIView
from photos.models import Photo, Rover
from .serializers import PhotoSerializer, RoverSerializer

DEFAULTS = {
    'sol': 0,
    'camera__name': 'FHAZ', 
}


class PhotoView(RetrieveAPIView):
    """Return photo with associated next, prev and adjacent photos."""

    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer


class RoverView(RetrieveAPIView):
    """Return photo with associated next, prev and adjacent photos."""

    queryset = Rover.objects.all()
    serializer_class = RoverSerializer

    def retrieve(request, *args, **kwargs):
        """Extend method to retrieve the rover."""
        params = request.GET.dict()
        # earth_date
        # sol
        # camera

