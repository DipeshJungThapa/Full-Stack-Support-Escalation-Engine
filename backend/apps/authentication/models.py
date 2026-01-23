from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        USER = 'USER', 'User'
        AGENT = 'AGENT', 'Agent'
        ADMIN = 'ADMIN', 'Admin'

    email = models.EmailField(unique=True)
    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.USER
    )

    # Use email as the username field
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Keep username required for creating superuser, or remove if we want pure email auth

    def __str__(self):
        return self.email
