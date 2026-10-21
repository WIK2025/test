from rest_framework import serializers
from .models import Note, Tag
from django.contrib.auth.models import User
from rest_framework import serializers

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class NoteSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    
    # временные поля для записи многие ко многим
    tag_ids = serializers.ListField(child=serializers.IntegerField(), required=False, write_only=True)
    tag_names = serializers.ListField(child=serializers.CharField(), required=False, write_only=True)

    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'tags', 'is_pinned', 'tag_ids', 'tag_names', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Заголовок заметки не может быть пустым.")
        return value

    def _process_tags(self, note_instance, tag_ids=None, tag_names=None):
        tags_to_set = []
        if tag_ids:
            tags_to_set.extend(Tag.objects.filter(id__in=tag_ids))
        if tag_names:
            for name in tag_names:
                clean_name = name.strip().lower()
                if clean_name:
                    tag_obj, _ = Tag.objects.get_or_create(name=clean_name)
                    tags_to_set.append(tag_obj)
        if tag_ids is not None or tag_names is not None:
            note_instance.tags.set(tags_to_set)

    def create(self, validated_data):
        tag_ids = validated_data.pop('tag_ids', None)
        tag_names = validated_data.pop('tag_names', None)
        note = Note.objects.create(**validated_data)
        self._process_tags(note, tag_ids=tag_ids, tag_names=tag_names)
        return note

    def update(self, instance, validated_data):
        tag_ids = validated_data.pop('tag_ids', None)
        tag_names = validated_data.pop('tag_names', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        self._process_tags(instance, tag_ids=tag_ids, tag_names=tag_names)
        return instance
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user