from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from .models import User, WasteRequest
from django.contrib.auth import get_user_model


# ==============================
#  WHEN REQUEST CREATED
# ==============================
@receiver(post_save, sender=WasteRequest)
def request_created(sender, instance, created, **kwargs):
    if created:
        if instance.user.email:
            send_mail(
                subject="Waste Request Created",
                message=f"""
Hello {instance.user.username},

Your waste pickup request has been created successfully.

Waste Type: {instance.waste_type}
Address: {instance.address}
Pickup Date: {instance.pickup_date}

We will assign a collector soon.
""",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[instance.user.email],
                fail_silently=True,
            )


# ==============================
#  WHEN COLLECTOR ASSIGNED
# ==============================
@receiver(post_save, sender=WasteRequest)
def collector_assigned(sender, instance, **kwargs):

    if instance.collector and instance.status == "assigned":

        # EMAIL TO USER
        if instance.user.email:
            send_mail(
                subject="Collector Assigned",
                message=f"""
Hello {instance.user.username},

A collector has been assigned to your request.

Collector: {instance.collector.username}
Pickup Date: {instance.pickup_date}
""",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[instance.user.email],
                fail_silently=True,
            )

        # EMAIL TO COLLECTOR
        if instance.collector.email:
            send_mail(
                subject="New Pickup Assigned",
                message=f"""
Hello {instance.collector.username},

You have a new pickup assigned.

User: {instance.user.username}
Address: {instance.address}
Pickup Date: {instance.pickup_date}
""",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[instance.collector.email],
                fail_silently=True,
            )


# ==============================
# WHEN COMPLETED
# ==============================
@receiver(post_save, sender=WasteRequest)
def request_completed(sender, instance, **kwargs):

    if instance.status == "completed":

        if instance.user.email:
            send_mail(
                subject="Pickup Completed",
                message=f"""
Hello {instance.user.username},

Your waste pickup has been completed successfully.

Thank you for using our service 
""",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[instance.user.email],
                fail_silently=True,
            )


# ==============================
#  WHEN CANCELLED (DELETED)
# ==============================
@receiver(post_delete, sender=WasteRequest)
def request_deleted(sender, instance, **kwargs):

    if instance.user.email:
        send_mail(
            subject="Request Cancelled",
            message=f"""
Hello {instance.user.username},

Your waste pickup request has been cancelled.

If this was a mistake, please create a new request.
""",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[instance.user.email],
            fail_silently=True,
        )


#   account creation email
@receiver(post_save, sender=User)
def send_registration_email(sender, instance, created, **kwargs):
    if created and instance.email:
        send_mail(
            subject="Welcome to Waste Management System",
            message=f"""
Hello {instance.username},

Your account has been created successfully 

You can now login and request waste pickup.

Thank you for joining Waste Management System.
""",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[instance.email],
            fail_silently=True,
        )