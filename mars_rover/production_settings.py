"""Production settings for deployment on AWS."""
from __future__ import unicode_literals
from marsrover.settings import *

DEBUG = False
ALLOWED_HOSTS.extend(
    ['.us-west-2.compute.amazonaws.com',
     '.will-weatherford.com',
     ]
)
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_DIRS = ('staticfiles',)

SITE_URL = 'http://marsrover.will-weatherford.com'
