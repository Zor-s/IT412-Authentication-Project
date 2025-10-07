# from django import views
from django.urls import path
from .views import hello
from api import views

urlpatterns = [
    path('hello/', hello),
    path('signup/', views.signup, name='signup'),

]
