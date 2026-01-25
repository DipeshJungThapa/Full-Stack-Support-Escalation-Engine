from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.tickets.models import Ticket
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now()
        first_day_current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_prev_month = first_day_current_month - timedelta(days=1)
        first_day_prev_month = last_day_prev_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        base_queryset = Ticket.objects.all()
        if user.role == 'USER':
             base_queryset = base_queryset.filter(created_by=user)

        # Helper to get stats for a period
        def get_period_stats(queryset, start_date, end_date=None):
            q = queryset.filter(created_at__gte=start_date)
            if end_date:
                q = q.filter(created_at__lte=end_date)
            
            stats = q.values('status').annotate(count=Count('id'))
            counts = {'OPEN': 0, 'IN_PROGRESS': 0, 'ESCALATED': 0, 'RESOLVED': 0, 'CLOSED': 0}
            for item in stats:
                counts[item['status']] = item['count']
            
            total = sum(counts.values())
            res = {'counts': counts, 'total': total}
            res['open_total'] = counts['OPEN'] + counts['IN_PROGRESS'] + counts['ESCALATED']
            res['resolved_total'] = counts['RESOLVED'] + counts['CLOSED']
            return res

        current_stats = get_period_stats(base_queryset, first_day_current_month)
        prev_stats = get_period_stats(base_queryset, first_day_prev_month, last_day_prev_month)

        def calculate_trend(current, prev):
            if prev == 0:
                return f"+{current * 100}%" if current > 0 else "0%"
            diff = ((current - prev) / prev) * 100
            return f"{'+' if diff >= 0 else ''}{round(diff, 1)}%"

        result = {
            # Current Status Counts (Overall)
            'status_counts': current_stats['counts'],
            'TOTAL': base_queryset.count(), # Total ever for the main display? Or just this month? Usually total is total.
            
            # For specific UI blocks
            'current_month_total': current_stats['total'],
            'total_trend': calculate_trend(current_stats['total'], prev_stats['total']),
            
            'current_open': current_stats['open_total'],
            'open_trend': calculate_trend(current_stats['open_total'], prev_stats['open_total']),

            'current_resolved': current_stats['resolved_total'],
            'resolved_trend': calculate_trend(current_stats['resolved_total'], prev_stats['resolved_total']),
            
            # Compatibility with existing frontend structure for a bit
            'OPEN': current_stats['counts']['OPEN'],
            'IN_PROGRESS': current_stats['counts']['IN_PROGRESS'],
            'RESOLVED': current_stats['counts']['RESOLVED'],
            'CLOSED': current_stats['counts']['CLOSED']
        }
        
        return Response(result)
