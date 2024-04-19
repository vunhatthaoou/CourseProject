from django.core import serializers
from rest_framework import serializers
from courses.models import Category, Courses, Lesson, Tag, User, Comment

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
class ItemSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        req = super().to_representation(instance)
        req['image'] = instance.image.url
        return req

class CourseSerializer( ItemSerializer):

    class Meta:
        model = Courses
        fields = ['id', 'name', 'image', 'create_date']

class LessonSerializers(ItemSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'subject', 'image', 'create_date']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id','name']

class LessonDetailSerializer(LessonSerializers):
    tags = TagSerializer(many= True)
    class Meta:
        model = LessonSerializers.Meta.model
        fields = LessonSerializers.Meta.fields + ['content', 'tags']

class AuthenticatedLessonDetailsSerializer(LessonDetailSerializer):
    liked = serializers.SerializerMethodField()

    def get_liked(self, lesson):
        request = self.context.get('request')
        if request:
            return lesson.like_set.filter(user=request.user, active=True).exists()

    class Meta:
        model = LessonDetailSerializer.Meta.model
        fields = LessonSerializers.Meta.fields + ['liked']
class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        data = validated_data.copy()
        u = User(**data)
        u.set_password(u.password)
        u.save()
        return u

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.avatar:
            rep['avatar'] = instance.avatar.url
        return rep
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'avatar']
        extra_kwargs = {
            'password': {
                'write_only' : True
            }
        }

class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Comment
        fields = ['id','content', 'create_date', 'updated_date','user']
