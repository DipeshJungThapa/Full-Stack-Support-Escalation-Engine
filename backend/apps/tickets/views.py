from rest_framework import viewsets, permissions, status, decorators
from rest_framework.response import Response
from .models import Ticket, TicketComment
from .serializers import TicketSerializer, TicketCommentSerializer
from apps.authentication.permissions import IsAgent, IsAdmin

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    # Default permission: Authenticated users can list/create.
    # Detail permissions handled in get_permissions or check_object_permissions ideally.
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Ticket.objects.all()
        elif user.role == 'AGENT':
            # Agent sees unassigned tickets OR assigned to them OR created by them
            # Logic: (assigned_to=user) OR (assigned_to=None) OR (created_by=user)
            # For simplicity: show all for agents or specific logic? 
            # PRD: Agent views assigned tickets. Let's start with assigned + unassigned logic.
            return Ticket.objects.filter(models.Q(assigned_to=user) | models.Q(assigned_to__isnull=True) | models.Q(created_by=user))
        else:
            # Regular users see their own tickets
            return Ticket.objects.filter(created_by=user)
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @decorators.action(detail=True, methods=['post'], permission_classes=[IsAgent])
    def assign(self, request, pk=None):
        """Allow agents/admins to assign tickets to themselves or others."""
        ticket = self.get_object()
        target_user = request.user 
        
        # If ID provided and user is admin, can assign to others (Extension)
        # For now, Agent claims the ticket
        
        ticket.assigned_to = target_user
        ticket.status = Ticket.Status.IN_PROGRESS
        ticket.save()
        return Response(TicketSerializer(ticket).data)

    @decorators.action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def change_status(self, request, pk=None):
        ticket = self.get_object()
        new_status = request.data.get('status')
        
        # Validation logic (Level 3 State Machine will improve this)
        if new_status in Ticket.Status.values:
            ticket.status = new_status
            ticket.save()
            return Response(TicketSerializer(ticket).data)
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = TicketCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # We expect a nested lookup or query param e.g. ?ticket_id=...
        # For nested routing via drf-nested-routers is best, but keeping simple:
        ticket_id = self.request.query_params.get('ticket_id')
        if ticket_id:
            return TicketComment.objects.filter(ticket_id=ticket_id)
        return TicketComment.objects.none()

    def perform_create(self, serializer):
        # Needs ticket_id passed in body or URL
        ticket_id = self.request.data.get('ticket') 
        # Serializer handles 'author' from context
        serializer.save(author=self.request.user)
