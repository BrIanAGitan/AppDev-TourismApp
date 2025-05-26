from django.contrib import admin
from django.urls import path, include
from .views import register_user, LoginUserView, CustomTokenObtainPairView, BookingListCreateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', register_user, name='register'),
    path('api/login/', LoginUserView.as_view(), name='login'),
    path('api/api/login/', CustomTokenObtainPairView.as_view(), name='custom_login'),
    path('api/bookings/', BookingListCreateView.as_view(), name='bookings'),
]