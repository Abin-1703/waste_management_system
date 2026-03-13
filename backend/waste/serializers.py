from rest_framework import serializers
from .models import WasteRequest

class WasteRequestSerializer(serializers.ModelSerializer):

    collector_name = serializers.CharField(source="collector.username", read_only=True)
    collector_email = serializers.CharField(source="collector.email", read_only=True)
    collector_phone = serializers.CharField(source="collector.phone", read_only=True)

    waste_image = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = WasteRequest
        fields = "__all__"   
        read_only_fields = ["user","created_at","status"]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        request = self.context.get("request")

        # image URL fix
        if instance.waste_image and request:
            data["waste_image"] = request.build_absolute_uri(instance.waste_image.url)

        # collector safe handling
        if not instance.collector:
            data["collector_name"] = None
            data["collector_email"] = None
            data["collector_phone"] = None

        return data