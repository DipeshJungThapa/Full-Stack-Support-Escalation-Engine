from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMIN'

class IsAgent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.role == 'AGENT' or request.user.role == 'ADMIN')

class IsOwnerOrAgent(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object (ticket) or agents/admins to edit it.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['ADMIN', 'AGENT']:
            return True
        # Instance must have an attribute named 'created_by'.
        return obj.created_by == request.user
