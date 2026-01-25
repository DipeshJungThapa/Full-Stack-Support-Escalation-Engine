from django.apps import AppConfig
from django.db.models.signals import post_migrate

class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.authentication'

    def ready(self):
        post_migrate.connect(create_google_social_app, sender=self)

def create_google_social_app(sender, **kwargs):
    from allauth.socialaccount.models import SocialApp
    from django.contrib.sites.models import Site
    from django.conf import settings
    import environ
    import os

    # Load env again to ensure we have keys
    env = environ.Env()
    BASE_DIR = settings.BASE_DIR
    environ.Env.read_env(os.path.join(BASE_DIR, '.env'))
    
    client_id = env('GOOGLE_OAUTH_CLIENT_ID', default='')
    secret = env('GOOGLE_OAUTH_CLIENT_SECRET', default='')

    if client_id and secret:
        # 1. Ensure Site #1 exists and is correct
        site_domain = getattr(settings, 'SITE_DOMAIN', 'localhost:8000')
        site_name = getattr(settings, 'SITE_NAME', 'localhost')
        
        # First, check if another site already has our domain to avoid IntegrityError
        conflicting_sites = Site.objects.filter(domain=site_domain).exclude(id=settings.SITE_ID)
        if conflicting_sites.exists():
            import logging
            logger = logging.getLogger(__name__)
            logger.warning(f"Deleting {conflicting_sites.count()} conflicting site(s) with domain '{site_domain}'")
            conflicting_sites.delete()
        
        site, _ = Site.objects.get_or_create(id=settings.SITE_ID, defaults={'domain': site_domain, 'name': site_name})
        if site.domain != site_domain:
            site.domain = site_domain
            site.name = site_name
            site.save()
        
        # 2. Get or create the SocialApp
        app, created = SocialApp.objects.get_or_create(
            provider='google',
            defaults={
                'name': 'Google Login',
                'client_id': client_id,
                'secret': secret,
            }
        )
        if not created:
            app.client_id = client_id
            app.secret = secret
            app.save()
            
        # 3. Ensure it's linked to the correct site
        if not app.sites.filter(id=site.id).exists():
            app.sites.add(site)
