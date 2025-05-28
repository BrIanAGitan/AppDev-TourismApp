from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status, generics, permissions, viewsets
from rest_framework.views import APIView  # ✅ Add this line
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .serializers import CustomTokenObtainPairSerializer
from .serializers import UserSerializer
from .models import Booking
from .serializers import BookingSerializer


# JWT customization
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Accept 'email' instead of 'username'
        email = attrs.get("username") or attrs.get("email")
        password = attrs.get("password")

        if email and password:
            try:
                user_obj = User.objects.get(email=email)
                attrs["username"] = user_obj.username  # Set username for parent validation
            except User.DoesNotExist:
                pass  # Let parent raise invalid credentials

        return super().validate(attrs)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data.update({
            'user_id': self.user.id,
            'email': self.user.email,
            'username': self.user.username,
        })
        return data

class CustomLoginView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer  # Or your custom serializer if needed
    permission_classes = [AllowAny]

# Registration
@api_view(['POST'])
@permission_classes([AllowAny])  # ✅ ALLOWS public registration
def register_user(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if not username or not email or not password:
        return Response({"detail": "Username, email, and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"detail": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"detail": "Email already in use."}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({"detail": "User registered successfully."}, status=status.HTTP_201_CREATED)

# Login
class LoginUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"detail": "Both email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            })
        else:
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

# Booking list/create
class BookingListCreateView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Booking ViewSet for full CRUD
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return bookings for the authenticated user
        return Booking.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Get bookings for authenticated user (API endpoint)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_bookings(request):
    print("Request user:", request.user)
    if not request.user.is_authenticated:
        return Response({'error': 'User not authenticated'}, status=401)

    try:
        bookings = Booking.objects.filter(user=request.user)
        serializer = BookingSerializer(bookings, many=True)
        return Response(serializer.data)
    except Exception as e:
        print("Error in get_bookings:", str(e))
        return Response({'error': 'Failed to fetch bookings'}, status=500)

# In your UserSerializer (serializers.py)
def create(self, validated_data):
    user = User.objects.create_user(
        username=validated_data["username"],
        email=validated_data["email"],
        password=validated_data["password"],
    )
    user.is_active = True  # Ensure user is active by default
    user.save()
    return user
