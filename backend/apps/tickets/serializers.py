from rest_framework import serializers
from .models import Ticket, TicketComment

class TicketCommentSerializer(serializers.ModelSerializer):
    author_email = serializers.EmailField(source='author.email', read_only=True)

    class Meta:
        model = TicketComment
        fields = '__all__'
        read_only_fields = ('author', 'created_at', 'ticket')

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

class TicketSerializer(serializers.ModelSerializer):
    created_by_email = serializers.EmailField(source='created_by.email', read_only=True)
    assigned_to_email = serializers.EmailField(source='assigned_to.email', read_only=True)
    # Basic comment info (could load full comments via separate endpoint for performance)
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at', 'updated_at', 'last_activity_at')

    def create(self, validated_data):
        # Assign creator from context
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
