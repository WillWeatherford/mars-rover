from django.shortcuts import render

# Create your views here.


from django.views.generic import TemplateView
# Create your views here.


class ClassView(TemplateView):
    """Home page template."""

    template_name = 'base.html'
