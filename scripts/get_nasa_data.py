"""Call the NASA Mars Rover Photo API and return image data."""
from __future__ import unicode_literals

import re
import os
import requests
from operator import itemgetter
from itertools import count, combinations
from photos.models import Photo


import django
django.setup()


LEFT_LENS_URL = '%L___-BR.JPG'
RIGHT_LENS_URL = '%R___-BR.JPG'
LOW_RES_SPI_OPP = r'ESF.{7}\-BR\.JPG'
BAD_CUR = r'.(M|D).{7}(NCAM|TRAV|SAPP).{7}\.JPG'

SAMPLE_DATA_PATH = os.environ.get('SAMPLE_DATA_PATH')

BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers'

FHAZ = 'FHAZ'
RHAZ = 'RHAZ'
MAST = 'MAST'
MAHLI = 'MAHLI'
NAVCAM = 'NAVCAM'
PANCAM = 'PANCAM'

ROVERS = {
    'Curiosity': {
        'cameras': {FHAZ, RHAZ, NAVCAM, MAST, MAHLI},
        'url': '/'.join((BASE_URL, 'curiosity/photos')),
    },
    'Opportunity': {
        'cameras': {FHAZ, RHAZ, NAVCAM, PANCAM},
        'url': '/'.join((BASE_URL, 'opportunity/photos')),
    },
    'Spirit': {
        'cameras': {FHAZ, RHAZ, NAVCAM, PANCAM},
        'url': '/'.join((BASE_URL, 'spirit/photos')),
    }
}
NASA_API_KEY = os.environ.get('NASA_API_KEY')


def populate_photos():
    """Fill database with photos from NASA API."""
    api_key = NASA_API_KEY
    sol_counter = count()
    prev_photos = {key: {cam_name: None for cam_name in dict_['cameras']}
                   for key, dict_ in ROVERS.items()}

    while True:
        sol = next(sol_counter)
        for rover, dict_ in ROVERS.items():
            url = dict_['url']
            for camera in dict_['cameras']:

                photos = get_photos(url, sol, camera, api_key)
                photos = filter(is_good_photo, photos)
                photos = sorted(photos, key=itemgetter('img_src'))

                for pair in combinations(photos, 2):
                    shortest, longest = sorted(pair, key=len)

            # connect previous and next
            # Filter only left lens of double-lens cam
            # Add photos to database
            # use get_or_create based on nasa_id
            # or make nasa_id unique and catch DB errors


def get_photos(url, sol, camera, api_key):
    """Get all photos from one sol from one camera."""
    found_ids = set()
    page_counter = count(1)
    while True:
        page = next(page_counter)
        page_photos = make_page_request(url, sol, camera, api_key, page)
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
