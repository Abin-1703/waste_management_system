from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
User = get_user_model()
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.hashers import make_password


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def collectors_list(request):
    collectors = User.objects.filter(role="collector")
    data=[{"id": c.id, "username": c.username, "email": c.email} for c in collectors]
    return Response(data)

# =========================
# REGISTER VIEW
# =========================
class Register(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []   #  (important)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                "token": token.key,
                "role": getattr(user, "role", "user")
            })

        return Response(serializer.errors, status=400)


# =========================
# LOGIN VIEW
# =========================
class Login(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []   # ADD THIS

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if not user:
            return Response({"error": "Invalid credentials"}, status=401)

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            "token": token.key,
            "role": getattr(user, "role", "user"),
            "username": user.username
        })
    
class ForgotPassword(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error":"User not found"}, status=404)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        reset_link = f"http://localhost:5173/reset/{uid}/{token}"

        send_mail(
            subject="Password Reset",
            message=f"Click this link to reset password:\n{reset_link}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[email],
        )

        return Response({"message":"Reset link sent"})
    
class ResetPassword(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")
        password = request.data.get("password")

        try:
            user_id = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=user_id)
        except:
            return Response({"error":"Invalid link"}, status=400)

        if not default_token_generator.check_token(user, token):
            return Response({"error":"Token expired"}, status=400)

        user.password = make_password(password)
        user.save()

        return Response({"message":"Password reset successful"})
    
# =========================
# USER COUNT API (NEW)
# =========================
@api_view(['GET'])
@permission_classes([AllowAny])
def user_count(request):
    count = User.objects.count()
    return Response({"count": count})