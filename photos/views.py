from django.shortcuts import render

# Create your views here.


from django.views.generic import TemplateView
# Create your views here.


class ClassView(TemplateView):
    """Home page template."""

    template_name = 'photos/index.html'


class RoverView(TemplateView):
    """About view."""

    template_name = 'photos/rover.html'
