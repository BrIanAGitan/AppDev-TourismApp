from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    register_user,
    LoginUserView,
    CustomTokenObtainPairView,
    BookingListCreateView,
    BookingViewSet,
)

router = DefaultRouter()
router.register(r'bookings', BookingViewSet, basename='booking')

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('', include(router.urls)),
]
