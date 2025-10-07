# from django import views
from django.urls import path
from api import views

urlpatterns = [
    path("signup/", views.signup, name="signup"),
    path("session-user/", views.get_session_user, name="get_session_user"),
    path("logout/", views.logout, name="logout"),
    path("login/", views.login, name="login"),
]
