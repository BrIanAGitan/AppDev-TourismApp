from django.urls import path
from .views import register_user, LoginUserView, CustomTokenObtainPairView, BookingListCreateView

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('api/login/', CustomTokenObtainPairView.as_view(), name='custom_login'),
    path('bookings/', BookingListCreateView.as_view(), name='booking-list-create'),
    path('bookings/', BookingListCreateView.as_view(), name='bookings'),  # alias route
]
