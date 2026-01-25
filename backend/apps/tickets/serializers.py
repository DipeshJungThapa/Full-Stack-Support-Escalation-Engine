from rest_framework import serializers
from .models import Ticket, TicketComment, EscalationRule, Attachment

class AttachmentSerializer(serializers.ModelSerializer):
    uploaded_by_email = serializers.EmailField(source='uploaded_by.email', read_only=True)

    class Meta:
        model = Attachment
        fields = ('id', 'file', 'file_name', 'file_size', 'uploaded_by', 'uploaded_by_email', 'created_at')
        read_only_fields = ('uploaded_by', 'created_at')

class TicketCommentSerializer(serializers.ModelSerializer):
    author_email = serializers.EmailField(source='author.email', read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)

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
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ('created_by', 'created_at', 'updated_at', 'last_activity_at')

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class EscalationRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EscalationRule
        fields = '__all__'
