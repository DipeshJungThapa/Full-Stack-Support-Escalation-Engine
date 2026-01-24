from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Ticket, EscalationRule
from .services import TicketStatusService

@shared_task
def check_for_escalations():
    active_rules = EscalationRule.objects.filter(is_active=True)
    count = 0
    
    for rule in active_rules:
        # Threshold time: tickets with no activity since this time
        threshold_time = timezone.now() - timedelta(hours=rule.max_idle_hours)
        
        # Find candidates for escalation
        tickets_to_escalate = Ticket.objects.filter(
            status__in=[Ticket.Status.OPEN, Ticket.Status.IN_PROGRESS],
            priority=rule.priority_threshold,
            last_activity_at__lte=threshold_time
        )
        
        for ticket in tickets_to_escalate:
            ticket.status = Ticket.Status.ESCALATED
            ticket.save()
            count += 1
            
    return count
