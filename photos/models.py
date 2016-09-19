"""Models for the Photos, Cameras and Rovers."""
from django.db import models as md


class Photo(md.Model):
    """Data for one photo from a NASA Mars Rover."""

    nasa_id = md.IntegerField()
    sol = md.IntegerField()
    earth_date = md.DateField()
