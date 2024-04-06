from rest_framework import viewsets, generics, status, parsers
from courses.models import Category, Courses, Lesson, User
from courses import serializers,paginators
from rest_framework.decorators import action
from rest_framework.response import Response

class CategoryViewset(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer

class CourseViewset(viewsets.ViewSet, generics.ListAPIView):
    queryset = Courses.objects.filter(active = True)
    serializer_class = serializers.CourseSerializer
    pagination_class = paginators.ItemPaginator

    def get_queryset(self):
        queryset = self.queryset
        if self.action.__eq__('list'):
            q= self.request.query_params.get('q')
            if q:
                queryset = queryset.filter(name__icontains=q)
            cate_id = self.request.query_params.get('category_id')
            if cate_id:
                queryset= queryset.filter(category_id=cate_id)
        return queryset

    @action(methods=['get'], url_path='lessons', detail= True)
    def get_lessons(self, request, pk):
        lessons = self.get_object().lesson_set.filter(active= True)
        q = self.request.query_params.get('q')
        if q:
            lessons = lessons.filter(subject__icontains=q)
        return Response(serializers.LessonSerializers(lessons, many= True).data, status= status.HTTP_200_OK)

class LessonViewSet(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = Lesson.objects.prefetch_related('tags').filter(active = True)
    serializer_class = serializers.LessonDetailSerializer
    @action(methods=['get'], url_path='comments', detail=True)
    def get_comments(self, request, pk):
        comments = self.get_object().comment_set.select_related('user').all()
        return Response(serializers.CommentSerializer(comments,many= True).data,
                        status=status.HTTP_200_OK)

class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active = True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser,]

