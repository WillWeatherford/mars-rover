"""Views for returning data vi REST API."""
from __future__ import unicode_literals
from rest_framework.generics import RetrieveAPIView
from photos.models import Photo, Rover
from .serializers import PhotoSerializer

DEFAULTS = {
    'sol': 0,
    'camera__name': 'FHAZ',
}


class PhotoView(RetrieveAPIView):
    """Return photo with associated next, prev and adjacent photos."""

    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer


class RoverView(RetrieveAPIView):
    """Use call to Rover to get photos."""

    queryset = Rover.objects.all()
    serializer_class = PhotoSerializer

    def get_object(self, *args, **kwargs):
        """Extend get_object method."""
        rover = super(RoverView, self).get_object(*args, **kwargs)
        req_params = self.request.GET.dict()
        queryset = rover.photos

        # camera_name = req_params.pop('camera__name')
        # if camera_name:
        #     queryset = rover.cameras.get(name=camera_name).photos
        # else:
        #     queryset = rover.photos

        resp_params = DEFAULTS.copy()
        resp_params.update(req_params)

        if 'earth_date' in resp_params and 'sol' in resp_params:
            resp_params.pop('sol')

        # order_by?
        queryset = queryset.filter(**resp_params)
        return queryset.first()
