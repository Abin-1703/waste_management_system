from django.urls import path
from .views import Register, Login , collectors_list
from .views import ForgotPassword , ResetPassword
from .views import user_count

urlpatterns = [
    path('register/', Register.as_view()),
    path('login/', Login.as_view()),
    path('collectors/', collectors_list),
    path('forgot/', ForgotPassword.as_view()),
    path('reset/', ResetPassword.as_view()),
    path('count/', user_count),
]