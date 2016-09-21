"""Serializers to create JSON data from Photo objects."""
from __future__ import unicode_literals
from rest_framework import serializers as srz
from photos.models import Photo, Camera


class CameraSerializer(srz.ModelSerializer):
    """Serializer for Camera model."""

    class Meta:
        """Meta information for Camera serializer."""

        model = Camera
        fields = [
            'id',
            'name',
            'full_name',
        ]


class NestedPhotoSerializer(srz.ModelSerializer):
    """Serializer for Photo through nested relationships."""

    url = srz.HyperlinkedIdentityField(
        view_name='api:photo-detail',
        read_only=True
    )
    camera = CameraSerializer(read_only=True)

    class Meta:
        """Meta for limeted details on Photo model."""

        model = Photo
        fields = [
            "id",
            "url",
            "img_src",
            "camera",
        ]


class PhotoSerializer(srz.ModelSerializer):
    """Serializer for Photo class."""

    next_photo = NestedPhotoSerializer(read_only=True)
    prev_photo = NestedPhotoSerializer(read_only=True)
    concurrent = NestedPhotoSerializer(read_only=True, many=True)
    camera = CameraSerializer(read_only=True)

    class Meta:
        """Meta information for PhotoSerializer."""

        model = Photo
        fields = [
            "id",
            "sol",
            "img_src",
            "earth_date",
            "next_photo",
            "prev_photo",
            "concurrent",
            "camera",
        ]


