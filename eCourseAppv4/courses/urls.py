from django.contrib import admin
from django.urls import path,re_path, include
from  rest_framework import routers
from courses import views
r= routers.DefaultRouter()
r.register('categories', views.CategoryViewset, 'categories')
r.register('courses', views.CourseViewset, 'courses')
r.register('lessons', views.LessonViewSet, 'lessons')
r.register('users', views.UserViewSet, 'users')
r.register('comments', views.CommentViewSet, 'comments')

urlpatterns = [
    path('', include(r.urls))
]