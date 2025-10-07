import os
import binascii
from django.db import models
from hashlib import pbkdf2_hmac


# Create your models here.
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
        self.salt = binascii.hexlify(salt).decode()  # store as hex

        # Derive the password hash using PBKDF2-HMAC-SHA256
        hash_bytes = pbkdf2_hmac(
            "sha256", raw_password.encode(), salt, 100_000  # recommended iterations
        )
        self.password_hash = binascii.hexlify(hash_bytes).decode()

    def check_password(self, raw_password):
        salt_bytes = binascii.unhexlify(self.salt)
        hash_bytes = pbkdf2_hmac("sha256", raw_password.encode(), salt_bytes, 100_000)
        return binascii.hexlify(hash_bytes).decode() == self.password_hash

    def __str__(self):
        return self.fullname
