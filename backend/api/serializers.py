# backend/api/serializers.py

from rest_framework import serializers
from .models import User
import bleach
import re # <--- Import the regular expression module
from rest_framework.exceptions import ValidationError # <--- Import ValidationError

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["fullname", "email", "password"]

    def validate(self, data):
        """
        Cleans the fullname field to prevent XSS attacks.
        """
        if 'fullname' in data:
            data['fullname'] = bleach.clean(data['fullname'], tags=[], strip=True)
        return data

    def validate_password(self, value):
        """
        Apply password strength validation.
        """
        # 1. Length Check
        if len(value) < 12:
            raise ValidationError("Password must be at least 12 characters long.")

        # 2. Complexity Checks using Regular Expressions
        if not re.search(r'[A-Z]', value):
            raise ValidationError("Password must contain at least one uppercase letter.")
        
        if not re.search(r'[a-z]', value):
            raise ValidationError("Password must contain at least one lowercase letter.")

        if not re.search(r'[0-9]', value):
            raise ValidationError("Password must contain at least one number.")
            
        if not re.search(r'[\W_]', value): # \W matches any non-alphanumeric character
            raise ValidationError("Password must contain at least one special character.")

        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user