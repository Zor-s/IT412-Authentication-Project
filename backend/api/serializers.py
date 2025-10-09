# backend/api/serializers.py

from rest_framework import serializers
from .models import User
import bleach # <--- Import bleach

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["fullname", "email", "password"]

    def validate(self, data):
        """
        Cleans the fullname field to prevent XSS attacks.
        This is a robust, backend-enforced security measure.
        """
        # Use bleach.clean to strip any potential HTML tags from the fullname.
        # This ensures only plain text is stored in the database.
        if 'fullname' in data:
            data['fullname'] = bleach.clean(data['fullname'], tags=[], strip=True)
        return data

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user