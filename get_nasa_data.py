"""Call the NASA Mars Rover Photo API and return image data."""
from __future__ import unicode_literals, absolute_import

import re
import os
import sys
import json
import requests
from operator import itemgetter
from itertools import count, combinations
import django
django.setup()

from photos.models import Photo, Rover, Camera

# TODO: use these filters
LEFT_LENS_URL = '%L___-BR.JPG'
RIGHT_LENS_URL = '%R___-BR.JPG'

LOW_RES_SPI_OPP = r'ESF.{7}\-BR\.JPG'
BAD_CUR = r'.(M|D).{7}(NCAM|TRAV|SAPP).{7}\.JPG'

BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers/{}/photos'
INIT_DATA = 'initial_data.json'
NASA_API_KEY = os.environ['NASA_API_KEY']


def get_initial_data():
    """Get initial data as list of rovers from json file."""
    with open(INIT_DATA) as json_file:
        return json.load(json_file)


def iter_sol_rover(max_sol):
    """Generate sol/rover combinations."""
    sol_counter = count()
    rovers = Rover.objects.all()
    while True:
        sol = next(sol_counter)
        if max_sol is not None and sol > max_sol:
            break
        for rover in rovers:
            yield sol, rover


def make_rover_url(rover_name):
    """Make a url to query a rover's photos."""
    return BASE_URL.format(rover_name)


def populate_rovers_and_cameras(rover_data):
    """Populate Rover objects from pre-defined data."""
    for rover in rover_data:
        cameras = rover.pop('cameras')
        new_rover = Rover(**rover)
        new_rover.save()

        for camera in cameras:
            new_camera = Camera(**camera)
            new_camera.save()
            new_camera.rover = new_rover


def populate_photos(max_sol=None):
    """Fill database with photos from NASA API."""
    api_key = NASA_API_KEY

    rover_data = Rover.objects.all()
    prev_photos = {
        rover.name: {camera.name: None for camera in rover.cameras.all()}
        for rover in rover_data
    }

    for sol, rover in iter_sol_rover(max_sol):
        url = make_rover_url(rover.name)

        # Dict keeping track of just the photos from each cam at this sol.
        photos_this_sol = {}

        for camera in rover.cameras.all():
            photos = get_photos(url, sol, camera.name, api_key)
            photos = filter(is_good_photo, photos)
            photos = sorted(photos, key=itemgetter('img_src'))

            for photo in photos:
                print('Creating photo:\n{}\n'.format(photo))

                # Prepare params for init --overwrite dict with model
                photo['camera'] = camera
                photo['rover'] = rover
                new_photo = Photo(**photo)

                # Crucial association of prev_photo/next_photo relationship
                if prev_photos[rover.name][camera.name] is not None:
                    new_photo.prev_photo = prev_photos[rover.name][camera.name]
                new_photo.save()
                prev_photos[rover.name][camera.name] = new_photo

                photos_this_sol.setdefault(camera.name, []).append(new_photo)

        set_concurrent(photos_this_sol)

        # Filter only left lens of double-lens cam


def set_concurrent(photos_by_cam):
    """Set relationships between photos from same sol on different cameras."""
    for pair in combinations(photos_by_cam.values(), 2):
        shortest, longest = sorted(pair, key=len)
        # round up instead?
        ratio = len(longest) // len(shortest)

        for idx, photo in enumerate(shortest):
            try:
                other = longest[idx * ratio]
            except IndexError:
                other = longest[-1]
            photo.concurrent.add(other)

        for idx, photo in enumerate(longest):
            try:
                other = shortest[idx // ratio]
            except IndexError:
                other = shortest[-1]
            photo.concurrent.add(other)


def get_photos(url, sol, camera, api_key):
    """Get all photos from one sol from one camera."""
    found_ids = set()
    page_counter = count(1)
    while True:
        page = next(page_counter)
        page_photos = make_page_request(url, sol, camera, api_key, page)
        print('{} photos: sol={}, camera={}, page={}'.format(
            len(page_photos), sol, camera, page))
        if not page_photos:
            break
        for photo in page_photos:
            if photo["id"] not in found_ids:
                found_ids.add(photo['id'])
                yield photo


def make_page_request(url, sol, camera, api_key, page):
    """Make one page request from NASA API."""
    params = {
        'sol': sol,
        'camera': camera,
        'api_key': api_key,
        'page': page,
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        return []
    return response.json()['photos']


def is_good_photo(photo):
    """Return True if photo is usable; False if it is a bad photo."""
    img_src = photo['img_src']
    rover_name = photo['rover']['name']
    if rover_name == 'Curiosity':
        return re.search(BAD_CUR, img_src) is None
    return re.search(LOW_RES_SPI_OPP, img_src) is None


if __name__ == '__main__':

    rover_data = get_initial_data()
    populate_rovers_and_cameras(rover_data)
    try:
        populate_photos(int(sys.argv[1]))
    except IndexError:
        populate_photos()
