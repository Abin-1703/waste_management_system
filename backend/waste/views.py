from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from django.core.mail import send_mail
from .models import WasteRequest
from .serializers import WasteRequestSerializer
from rest_framework.parsers import MultiPartParser, FormParser


# =========================
# CREATE REQUEST
# =========================
class CreateRequest(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = WasteRequestSerializer(data=request.data)
        if serializer.is_valid():
            obj = serializer.save(
            user=request.user,
            latitude=request.data.get("latitude"),
            longitude=request.data.get("longitude")
        )
            # EMAIL TO USER
            if request.user.email:
                send_mail(
                    subject="Waste Pickup Request Created",
                    message=f"""
Hello {request.user.username},

Your waste pickup request has been created successfully.

Waste Type: {obj.waste_type}
Quantity: {obj.quantity}
Address: {obj.address}
Pickup Date: {obj.pickup_date}

Our team will process your request shortly.

Thank you for using Waste Management System.
""",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[request.user.email],
                    fail_silently=True,
                )

            #  RETURN WITH REQUEST CONTEXT (IMPORTANT FOR IMAGE URL)
            return Response(
                WasteRequestSerializer(obj, context={"request": request}).data
            )

        return Response(serializer.errors, status=400)


# =========================
# USER REQUEST LIST
# =========================
class MyRequests(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = WasteRequest.objects.filter(user=request.user)

        serializer = WasteRequestSerializer(
            qs,
            many=True,
            context={"request": request}
        )

        return Response(serializer.data)

# =========================
# DELETE REQUEST
# =========================
class DeleteRequest(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            obj = WasteRequest.objects.get(id=id, user=request.user)

            if request.user.email:
                send_mail(
                    subject="Waste Pickup Request Cancelled",
                    message=f"""
Hello {request.user.username},

Your waste pickup request has been cancelled.

Waste Type: {obj.waste_type}
Address: {obj.address}

Waste Management Team
""",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[request.user.email],
                    fail_silently=True,
                )

            obj.delete()
            return Response({"message": "Request deleted"})

        except WasteRequest.DoesNotExist:
            return Response({"error": "Not found"}, status=404)


# =========================
# COLLECTOR JOB LIST
# =========================
class CollectorJobs(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = WasteRequest.objects.filter(collector=request.user)

        data = []
        for r in qs:
            data.append({
                "id": r.id,
                "waste_type": r.waste_type,
                "quantity": r.quantity,
                "address": r.address,
                "latitude": r.latitude,
                "longitude": r.longitude,
                "pickup_date": r.pickup_date,
                "status": r.status,
                "phone": r.phone,
                "waste_image": (
                    request.build_absolute_uri(r.waste_image.url)
                    if r.waste_image else None
                ),

                # collector info
                "collector_name": r.collector.username if r.collector else None,
                "collector_email": r.collector.email if r.collector else None,
                "collector_photo": (
                    request.build_absolute_uri(r.collector.photo.url)
                    if r.collector and getattr(r.collector, "photo", None)
                    else None
                )
            })

        return Response(data)


# =========================
# COLLECTOR MARK COMPLETE
# =========================
class UpdateRequestStatus(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            req = WasteRequest.objects.get(pk=pk)

            if req.collector != request.user:
                return Response({"error": "Not allowed"}, status=403)

            req.status = "completed"
            req.save()

            if req.user.email:
                send_mail(
                    subject="Waste Pickup Completed",
                    message=f"""
Hello {req.user.username},

Your waste pickup request has been successfully completed.

Waste Type: {req.waste_type}
Address: {req.address}
Pickup Date: {req.pickup_date}

Thank you for helping keep the environment clean
""",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[req.user.email],
                    fail_silently=True,
                )

            return Response({"message": "Completed successfully"})

        except WasteRequest.DoesNotExist:
            return Response({"error": "Not found"}, status=404)


# =========================
# ADMIN LIST ALL REQUESTS
# =========================
class AdminRequests(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if getattr(request.user, "role", "") != "admin":
            return Response({"error": "Not allowed"}, status=403)

        qs = WasteRequest.objects.all().order_by("-created_at")

        #  CONTEXT FIX FOR IMAGE URL
        return Response(
            WasteRequestSerializer(qs, many=True, context={"request": request}).data
        )


# =========================
# ADMIN UPDATE REQUEST
# =========================
class AdminUpdateRequest(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        if getattr(request.user, "role", "") != "admin":
            return Response({"error": "Not allowed"}, status=403)

        try:
            req = WasteRequest.objects.get(pk=pk)

            req.status = request.data.get("status", req.status)
            req.pickup_date = request.data.get("pickup_date", req.pickup_date)

            collector_id = request.data.get("collector")
            if collector_id:
                from django.contrib.auth import get_user_model
                User = get_user_model()
                req.collector = User.objects.get(id=collector_id)

            req.save()
            return Response({"message": "Updated successfully"})

        except WasteRequest.DoesNotExist:
            return Response({"error": "Not found"}, status=404)