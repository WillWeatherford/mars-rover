"""Models for the Photos, Cameras and Rovers."""
from django.db import models as md


class Photo(md.Model):
    """Data for one photo from a NASA Mars Rover."""

    # Make this the primary key?
    nasa_id = md.IntegerField(unique=True)
    sol = md.IntegerField()
    earth_date = md.DateField()
    img_src = md.URLField(max_length=400)
