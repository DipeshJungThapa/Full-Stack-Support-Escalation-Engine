from django.contrib import admin
from .models import User, Expense


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'name', 'date_joined', 'is_active']
    list_filter = ['is_active', 'date_joined']
    search_fields = ['email', 'name']
    ordering = ['-date_joined']


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['title', 'amount', 'category', 'date', 'user', 'created_at']
    list_filter = ['category', 'date', 'created_at']
    search_fields = ['title', 'description', 'user__email']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
