import os
import binascii
from django.db import models
from hashlib import pbkdf2_hmac
from django.conf import settings


# User model with custom password hashing using PBKDF2, salt, and pepper
class User(models.Model):
    fullname = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=128)
    salt = models.CharField(max_length=64)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def set_password(self, raw_password):
        # Generate a random 32-byte salt
        salt = os.urandom(32)
        self.salt = binascii.hexlify(salt).decode()  # Store salt as hex string

        # Add pepper to the password before hashing
        peppered_password = (
            raw_password + settings.PEPPER + raw_password + settings.PEPPER
        ).encode()

        # Derive the password hash using PBKDF2-HMAC-SHA256 with 1,000,000 iterations
        hash_bytes = pbkdf2_hmac("sha256", peppered_password, salt, 1_000_000)
        self.password_hash = binascii.hexlify(hash_bytes).decode()

    def check_password(self, raw_password):
        # Convert stored hex salt back to bytes
        salt_bytes = binascii.unhexlify(self.salt)

        # Add pepper to the password before hashing
        peppered_password = (
            raw_password + settings.PEPPER + raw_password + settings.PEPPER
        ).encode()

        # Recompute the hash with the same parameters
        hash_bytes = pbkdf2_hmac(
            "sha256",
            peppered_password,
            salt_bytes,
            1_000_000,
        )

        # Compare the computed hash with the stored hash
        return binascii.hexlify(hash_bytes).decode() == self.password_hash

    def __str__(self):
        # Return the user's full name as the string representation
        return self.fullname
