from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, CommentViewSet, EscalationRuleViewSet

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'escalation-rules', EscalationRuleViewSet, basename='escalation-rule')

urlpatterns = [
    path('', include(router.urls)),
]
