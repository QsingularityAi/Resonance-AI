from django.urls import path
from . import views

urlpatterns = [
    path("demo/<uuid:id>/", views.index, name="index"),
    path("demo/<uuid:id>/fullscreen", views.indexFullscreen, name="indexFullscreen"),
    path("demo/<uuid:id>/inline", views.indexInline, name="indexInline"),

]