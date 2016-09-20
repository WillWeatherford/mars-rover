"""Models for the Photos, Cameras and Rovers."""
from django.db import models as md


class Photo(md.Model):
    """Data for one photo from a NASA Mars Rover."""

    # Make this the primary key?
    nasa_id = md.IntegerField(unique=True)
    sol = md.IntegerField()
    earth_date = md.DateField()
    img_src = md.URLField(max_length=400)
    rover = md.ForeignKey("photos.Rover", related_name='photos', blank=True, null=True)
    next_photo = md.OneToOneField("photos.Photo", related_name='prev_photo')


class Rover(md.Model):
    """A Rover object; one of the three NASA rovers on Mars."""

    nasa_id = md.IntegerField(unique=True)
    name = md.CharField(max_length=30)
    landing_date = md.DateField()
    max_date = md.DateField()
    max_sol = md.IntegerField()
    total_photos = md.IntegerField()
