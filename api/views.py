"""Views for returning data vi REST API."""
from __future__ import unicode_literals
from rest_framework.generics import RetrieveAPIView
from photos.models import Photo, Rover
from .serializers import PhotoSerializer

START = {
    'Curiosity': {
        'sol': 0,
        'camera__name': 'FHAZ',
    },
    'Opportunity': {
        'sol': 1,
        'camera__name': 'PANCAM',
    },
    'Spirit': {
        'sol': 1,
        'camera__name': 'PANCAM',
    }
}


class PhotoView(RetrieveAPIView):
    """Return photo with associated next, prev and adjacent photos."""

    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer


class RoverView(RetrieveAPIView):
    """Use call to Rover to get photos."""

    lookup_field = 'name'
    queryset = Rover.objects.all()
    serializer_class = PhotoSerializer

    def get_object(self, *args, **kwargs):
        """Extend get_object method."""
        rover = super(RoverView, self).get_object(*args, **kwargs)
        params = START[rover.name].copy()
        params.update(self.request.GET.dict())

        camera = rover.cameras.get(name=params['camera__name'])
        queryset = camera.photos

        try:
            queryset = queryset.filter(earth_date=params['earth_date'])
        except KeyError:
            queryset = queryset.filter(sol=params['sol'])

        return queryset.sort_by('img_src').first()
