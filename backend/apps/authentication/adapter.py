from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.conf import settings

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def save_user(self, request, sociallogin, form=None):
        user = super().save_user(request, sociallogin, form)
        
        # Ensure username is set to email if available, else use UID
        if not user.username or user.username == "":
            user.username = user.email or f"{sociallogin.account.provider}_{sociallogin.account.uid}"
            user.save()
            
        return user

    def populate_user(self, request, sociallogin, data):
        user = super().populate_user(request, sociallogin, data)
        # Force username to be email if it exists, otherwise use account UID as fallback
        email = data.get("email") or user.email
        if email:
            user.username = email
        else:
            user.username = f"{sociallogin.account.provider}_{sociallogin.account.uid}"
        return user
