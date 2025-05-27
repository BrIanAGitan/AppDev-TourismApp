from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, Booking
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"
        read_only_fields = ["user"]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get("username")  # still getting 'username' field from payload
        password = attrs.get("password")

        try:
            user = User.objects.get(email=email)
            username = user.username
        except User.DoesNotExist:
            raise serializers.ValidationError("No user with this email")

        user = authenticate(username=username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid credentials")

        data = super().validate({"username": username, "password": password})
        # Optionally add more user info to the response
        data.update(
            {
                "user_id": user.id,
                "email": user.email,
                "username": user.username,
            }
        )
        return data
