from django.urls import path
from .views import CreateRequest, MyRequests

urlpatterns = [
    path("create/",CreateRequest.as_view()),
    path("my/",MyRequests.as_view()),
]