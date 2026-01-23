from django.http import JsonResponse

def index(request):
    return JsonResponse({
        "message": "Ticket Escalation System API is running",
        "endpoints": {
            "auth": "/api/auth/",
            "tickets": "/api/tickets/",
            "admin": "/admin/"
        }
    })
