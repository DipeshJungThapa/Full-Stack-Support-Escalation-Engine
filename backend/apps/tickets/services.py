from .models import Ticket

class TicketStatusService:
    VALID_TRANSITIONS = {
        Ticket.Status.OPEN: [Ticket.Status.IN_PROGRESS],
        Ticket.Status.IN_PROGRESS: [Ticket.Status.ESCALATED, Ticket.Status.RESOLVED, Ticket.Status.OPEN],
        Ticket.Status.ESCALATED: [Ticket.Status.IN_PROGRESS, Ticket.Status.RESOLVED, Ticket.Status.OPEN],
        Ticket.Status.RESOLVED: [Ticket.Status.CLOSED],
        Ticket.Status.CLOSED: []
    }

    @staticmethod
    def validate_transition(ticket, new_status, user):
        """
        Validates if a status transition is allowed based on the current status
        and the user's role.
        """
        # Admin can do anything
        if user.role == 'ADMIN':
            return True, ""

        # Agents can transition based on rules
        if user.role == 'AGENT':
            allowed_next = TicketStatusService.VALID_TRANSITIONS.get(ticket.status, [])
            if new_status in allowed_next:
                return True, ""
            return False, f"Invalid transition from {ticket.status} to {new_status}."

        # Regular users can only close resolved tickets they created
        if user.role == 'USER':
            if ticket.created_by == user and ticket.status == Ticket.Status.RESOLVED and new_status == Ticket.Status.CLOSED:
                return True, ""
            return False, "Users cannot change ticket status."

        return False, "Unauthorized to change status."

    @staticmethod
    def change_status(ticket, new_status, user):
        """
        Applies a status change if valid.
        """
        is_valid, error_message = TicketStatusService.validate_transition(ticket, new_status, user)
        if not is_valid:
            return False, error_message

        ticket.status = new_status
        ticket.save()
        return True, "Status updated successfully."
