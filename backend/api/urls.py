from django.urls import path
from .views import (
    register_user,
    LoginUserView,
    CustomTokenObtainPairView,
    BookingListCreateView
)

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('bookings/', BookingListCreateView.as_view(), name='bookings'),
]
