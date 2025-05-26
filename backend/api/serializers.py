from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, Booking


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "name", "email", "password"]
        extra_kwargs = {
            "password": {"write_only": True},
            "username": {"read_only": True},
        }

    def create(self, validated_data):
        validated_data["username"] = validated_data.pop("name")  # map 'name' to 'username'
        user = User.objects.create_user(**validated_data)
        return user


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
