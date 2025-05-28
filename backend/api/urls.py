from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    register_user,
    LoginUserView,
    CustomLoginView,
    BookingViewSet,
    BookingListCreateView,  # <-- Import your view
    get_user_profile,       # <-- Add this import
)

router = DefaultRouter()
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', LoginUserView.as_view(), name='login'),  # optional, legacy
    path('token/', CustomLoginView.as_view(), name='token_obtain_pair'),
    path('api/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('bookings/', BookingListCreateView.as_view(), name='booking-list-create'),  # <-- Add this line
    path('profile/', get_user_profile, name='user-profile'),  # <-- Add this line
    path('', include(router.urls)),
]
