from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

WASTE_TYPES = [
    ('dry', 'Dry'),
    ('wet', 'Wet'),
    ('glass', 'Glass'),
    ('wood', 'Wood'),
    ('paper', 'Paper'),
    ('metal', 'Metal'),
]

STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('approved', 'Approved'),
    ('assigned', 'Assigned'),      
    ('completed', 'Completed'),
]

class WasteRequest(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="requests"
    )

    # Collector assigned by admin
    collector = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_requests"
    )

    waste_type = models.TextField()
    quantity = models.IntegerField()
    address = models.TextField()
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    pickup_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    waste_image = models.ImageField(upload_to="waste_images/", null=True, blank=True)
   
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

   

    def __str__(self):
        return f"{self.user} - {self.waste_type} ({self.status})"
    