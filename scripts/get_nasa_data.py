"""Call the NASA Mars Rover Photo API and return image data."""
from __future__ import unicode_literals

import os
import requests
from itertools import count

import django
django.setup()

SAMPLE_DATA_PATH = os.environ.get('SAMPLE_DATA_PATH')

BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers'

ROVERS = {
    'Curiosity': '/'.join((BASE_URL, 'curiosity/photos')),
    'Opportunity': '/'.join((BASE_URL, 'opportunity/photos')),
    'Spirit': '/'.join((BASE_URL, 'spirit/photos')),
}
NASA_API_KEY = os.environ.get('NASA_API_KEY')


def populate_photos():
    """Fill database with photos from NASA API."""
    api_key = NASA_API_KEY
    sol_counter = count()
    prev_photo = None
    next_photo = None
    while True:
        sol = next(sol_counter)
        for rover, url in ROVERS.items():
            photos = get_one_sol_photos(url, sol, api_key)

            # Add all photos to database
            # use get_or_create based on nasa_id
            # or make nasa_id unique and catch DB errors
            # Filter out shitty ones


def get_one_sol_photos(url, sol, api_key):
    """Get all photos from one sol."""
    photos = []
    found_ids = set()
    page_counter = count(1)
    while True:
        page = next(page_counter)
        page_photos = make_page_request(url, sol, api_key, page)
        if not page_photos:
            break
        for photo in page_photos:
            if photo["id"] not in found_ids:
                photos.append(photo)
                found_ids.add(photo['id'])
    return photos


def make_page_request(url, sol, api_key, page):
    """Make one page request from NASA API."""
    params = {
        'sol': sol,
        'page': page,
        'api_key': api_key,
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        return []
    return response.json()['photos']
