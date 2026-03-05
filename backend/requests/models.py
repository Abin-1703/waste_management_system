from django.db import models
from django.conf import settings

class WasteRequest(models.Model):

    WASTE_TYPES = [
        ('dry','Dry Waste'),
        ('wet','Wet Waste'),
        ('glass','Glass'),
        ('paper','Paper'),
        ('wood','Wood'),
        ('metal','Metal'),
        ('plastic','Plastic'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE,
                             related_name="user_requests")

    waste_type = models.CharField(max_length=20, choices=WASTE_TYPES)

    address = models.CharField(max_length=255)
    pickup_date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.waste_type}"