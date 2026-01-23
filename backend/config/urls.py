from django.contrib import admin
from django.urls import path, include
from .views import index

urlpatterns = [
    path('', index, name='index'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/tickets/', include('apps.tickets.urls')),
]
