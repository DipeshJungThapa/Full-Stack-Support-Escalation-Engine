from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return Response(UserSerializer(user).data)
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]
    authentication_classes = []
    
    def post(self, request):
        logout(request)
        return Response({'message': 'Logged out successfully'})

class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # SIMULATED EMAIL LOGGING
            # In production, uses SendGrid/AWS SES
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
            reset_url = f"{frontend_url}/reset-password/{uid}/{token}"
            
            # TODO: Replace with actual email sending in production
            logger.info(f"Password reset requested for: {email}")
            logger.debug(f"Reset link: {reset_url}")
            
            # Keep print for development visibility if needed, or rely on logs
            print(f"Reset Link: {reset_url}") 
            
            return Response({'message': 'Password reset link sent to your email.'})
        except User.DoesNotExist:
            # Don't reveal if user exists for security
            return Response({'message': 'Password reset link sent to your email.'})

class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('password')
        
        if not new_password:
            return Response({'error': 'Password is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
            
            if default_token_generator.check_token(user, token):
                # Validate password complexity
                try:
                    validate_password(new_password, user)
                except DjangoValidationError as e:
                    return Response({'error': list(e.messages)}, status=status.HTTP_400_BAD_REQUEST)
                
                user.set_password(new_password)
                user.save()
                return Response({'message': 'Password reset successful.'})
            else:
                return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({'error': 'Invalid request.'}, status=status.HTTP_400_BAD_REQUEST)

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    permission_classes = [permissions.AllowAny]
    authentication_classes = []  # Completely disable default auth to avoid CSRF check
    
    @property
    def callback_url(self):
        return self.request.build_absolute_uri('/')

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        print(f"\n--- SOCIAL LOGIN RESPONSE ({response.status_code}) ---")
        print(f"Response Data: {response.data}")
        print("------------------------------------\n")
        
        # If login was successful, ensure we return JWT tokens
        if response.status_code == 200 and self.user:
            # Generate JWT tokens manually
            refresh = RefreshToken.for_user(self.user)
            response.data['access'] = str(refresh.access_token)
            response.data['refresh'] = str(refresh)
            response.data['user'] = UserSerializer(self.user).data
            print(f"JWT Tokens generated for user: {self.user.email}")
        
        if response.status_code == 400:
            print(f"Errors: {response.data}")
        return response
