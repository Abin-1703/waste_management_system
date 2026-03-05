from rest_framework import serializers
from .models import WasteRequest

class WasteRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteRequest
        fields = "__all__"
        read_only_fields = ["user","created_at","status"]