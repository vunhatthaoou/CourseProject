from django.db.models import Count

from courses.models import Category, Courses, Lesson
def get_courses(**kwargs):
    courses = Courses.objects.filter(active=True)

    q = kwargs.get('q')
    if q:
        courses = Courses.objects.filter(name__icontains=q)
    cate_id = kwargs.get('category_id')
    if cate_id:
        courses = courses.filter(category_id = cate_id)
    return courses.order_by('-id')

def count_courses_by_cate():
    return Category.objects.annotate(counter=Count('courses__id')).values('id', 'name', 'counter').all()