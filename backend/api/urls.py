from django.urls import path
from .views import register_user, LoginUserView

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', LoginUserView.as_view(), name='login'),
]
