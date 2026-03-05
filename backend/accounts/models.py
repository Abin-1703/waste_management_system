from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    email = models.EmailField(unique=True)

    ROLE_CHOICES = [
        ('user', 'User'),
        ('collector', 'Collector'),
        ('admin', 'Admin'),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='user'
    )

    # NEW FIELDS FOR COLLECTOR PROFILE
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    photo = models.ImageField(upload_to="collectors/", blank=True, null=True)

    def __str__(self):
        return self.username