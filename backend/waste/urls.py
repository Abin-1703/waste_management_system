from django.urls import path
from .views import (
    CreateRequest,
    MyRequests,
    DeleteRequest,
    CollectorJobs,
    UpdateRequestStatus,
)
from.views import AdminRequests,AdminUpdateRequest

urlpatterns = [
    path('create/', CreateRequest.as_view()),
    path('my/', MyRequests.as_view()),
    path('delete/<int:id>/', DeleteRequest.as_view()),
    path('collector/', CollectorJobs.as_view()),
    path('update/<int:pk>/', UpdateRequestStatus.as_view()),
    path('admin/', AdminRequests.as_view()),
    path('admin/update/<int:pk>/', AdminUpdateRequest.as_view()),
]