from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import SignupSerializer

from rest_framework import status
from django.contrib.sessions.models import Session
from .models import User


# Create your views here.
@api_view(["POST"])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # Create session for the new user
        request.session["user_id"] = user.id
        request.session["fullname"] = user.fullname
        request.session["email"] = user.email
        return Response(
            {
                "message": "User created and logged in successfully",
                "fullname": user.fullname,
            },
            status=201,
        )

    return Response(serializer.errors, status=400)


@api_view(["GET"])
def get_session_user(request):
    user_id = request.session.get("user_id")
    fullname = request.session.get("fullname")
    email = request.session.get("email")

    if not user_id or not fullname or not email:
        return Response(
            {"error": "Not authenticated"}, status=status.HTTP_401_UNAUTHORIZED
        )

    return Response({"fullname": fullname, "email": email}, status=status.HTTP_200_OK)


@api_view(["POST"])
def logout(request):
    request.session.flush()  # Clears all session data
    return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)


@api_view(["POST"])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )

    if not user.check_password(password):
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )

    # Assign session
    request.session["user_id"] = user.id
    request.session["fullname"] = user.fullname
    request.session["email"] = user.email
    return Response(
        {"message": "Login successful", "fullname": user.fullname},
        status=status.HTTP_200_OK,
    )
