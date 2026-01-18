from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    CurrentUserView,
    ExpenseListCreateView,
    ExpenseDetailView,
)

urlpatterns = [
    # Auth endpoints
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/me/', CurrentUserView.as_view(), name='current-user'),
    
    # Expense endpoints
    path('expenses/', ExpenseListCreateView.as_view(), name='expense-list'),
    path('expenses/<int:pk>/', ExpenseDetailView.as_view(), name='expense-detail'),
]
