from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Expense

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ('id', 'title', 'amount', 'category', 'date', 'description', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')
