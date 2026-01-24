from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.tickets.models import Ticket
from django.db.models import Count

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        base_queryset = Ticket.objects.all()

        if user.role == 'AGENT':
             # Maybe show stats relevant to agent or overall?
             # For now, overall stats if Agent/Admin, or personal if User
             pass
        elif user.role == 'USER':
             base_queryset = base_queryset.filter(created_by=user)

        stats = base_queryset.values('status').annotate(count=Count('id'))
        
        # Format for frontend
        result = {
            'OPEN': 0,
            'IN_PROGRESS': 0,
            'ESCALATED': 0,
            'RESOLVED': 0,
            'CLOSED': 0
        }
        for item in stats:
            result[item['status']] = item['count']
            
        result['TOTAL'] = sum(result.values())
        return Response(result)
