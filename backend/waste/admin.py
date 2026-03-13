from django.contrib import admin
from django.core.mail import send_mail
from django.conf import settings
from .models import WasteRequest


@admin.register(WasteRequest)
class WasteRequestAdmin(admin.ModelAdmin):

    # User shown first
    list_display = (
        "user",
        "id",
        "waste_type",
        "quantity",
        "status",
        "collector",
        "pickup_date",
        "created_at"
    )

    # Better filtering
    list_filter = (
        "collector",
        "status",
        "pickup_date",
        "created_at",
    )

    # Search support
    search_fields = (
        "user__username",
        "address",
        "waste_type",
    )

    # newest requests first
    ordering = ("-created_at",)

    # =========================
    # EMAIL WHEN COLLECTOR ASSIGNED
    # =========================
    def save_model(self, request, obj, form, change):

        # check only when editing existing object
        if change:
            old_obj = WasteRequest.objects.get(pk=obj.pk)

            # collector newly assigned or changed
            if old_obj.collector != obj.collector and obj.collector:

                # Email tO Collector
                if obj.collector.email:
                    send_mail(
                        subject="New Waste Pickup Assigned",
                        message=f"""
Hello {obj.collector.username},

You have been assigned a new waste pickup job.

Waste Type: {obj.waste_type}
Quantity: {obj.quantity}
Address: {obj.address}
Pickup Date: {obj.pickup_date}

Please login to your collector dashboard to view details.

Waste Management System
""",
                        from_email=settings.EMAIL_HOST_USER,
                        recipient_list=[obj.collector.email],
                        fail_silently=True,
                    )

                # Email to user
                if obj.user.email:
                    send_mail(
                        subject="Collector Assigned to Your Request",
                        message=f"""
Hello {obj.user.username},

A collector has been assigned to your waste pickup request.

Collector: {obj.collector.username}
Pickup Date: {obj.pickup_date}

The collector will arrive on schedule.

Thank you for using Waste Management System 🌱
""",
                        from_email=settings.EMAIL_HOST_USER,
                        recipient_list=[obj.user.email],
                        fail_silently=True,
                    )

        # save object normally
        super().save_model(request, obj, form, change)