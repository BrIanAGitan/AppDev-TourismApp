from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    register_user,
    LoginUserView,
    CustomLoginView,  # <-- Import your custom login view
    BookingListCreateView,
    BookingViewSet,
)

router = DefaultRouter()
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('token/', CustomLoginView.as_view(), name='token_obtain_pair'),  # <-- Use your custom login view
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
