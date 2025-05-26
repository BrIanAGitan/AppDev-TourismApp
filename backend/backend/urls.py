from django.contrib import admin
from django.urls import path, include
from api.views import CustomTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
]
