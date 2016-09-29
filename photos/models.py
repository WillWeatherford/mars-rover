"""Models for the Photos, Cameras and Rovers."""
from django.db import models as md
NULL_IMG_SRC = '/static/img/null_rover.jpg'


class Photo(md.Model):
    """Data for one photo from a NASA Mars Rover."""

    id          = md.IntegerField(unique=True, primary_key=True)
    sol         = md.IntegerField()
    earth_date  = md.DateField()
    is_null     = md.BooleanField(default=False)
    img_src     = md.URLField(max_length=400, default=NULL_IMG_SRC)
    rover       = md.ForeignKey('photos.Rover', related_name='photos')
    camera      = md.ForeignKey('photos.Camera', related_name='photos')
    prev_photo  = md.ForeignKey(
        'self',
        on_delete=md.SET_NULL,
        related_name='+',
        null=True,
    )
    next_photo  = md.ForeignKey(
        'self',
        on_delete=md.SET_NULL,
        related_name='+',
        null=True,
    )
    concurrent  = md.ManyToManyField('self', symmetrical=False)


class Rover(md.Model):
    """A Rover object; one of the three NASA rovers on Mars."""

    id = md.IntegerField(unique=True, primary_key=True)
    name = md.CharField(max_length=100)
    landing_date = md.DateField()
    max_date = md.DateField()
    max_sol = md.IntegerField()
    total_photos = md.IntegerField()


class Camera(md.Model):
    """Camera object attached to a Rover. Names duplicate; ids are unique."""

    id = md.IntegerField(unique=True, primary_key=True)
    name = md.CharField(max_length=100)
    full_name = md.CharField(max_length=100)
    rover = md.ForeignKey('photos.Rover', related_name='cameras')
