from django.contrib import admin
from courses.models import Category, Courses, Lesson, Tag, Comment
from django.utils.html import mark_safe
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django import forms
import cloudinary


class CourseForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Courses
        fields = '__all__'


class CourseAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'active', 'create_date', 'updated_date']
    search_fields = ['name']
    list_filter = ['id', 'name', 'create_date']
    readonly_fields = ['my_image']
    form = CourseForm

    def my_image(self, courses):
        if courses.image:
            if type(courses.image) is cloudinary.CloudinaryResource:
                return mark_safe(f"<img width='300' src='{courses.image.url}'/>")
            return mark_safe(f"<img width='300' src='/static/{courses.image.name}'/>")

    class Media:
        css = {
            'all': ['/static/css/style.css']
        }


# Register your models here.
admin.site.register(Category)
admin.site.register(Courses, CourseAdmin)
admin.site.register(Lesson)
admin.site.register(Tag)
admin.site.register(Comment)