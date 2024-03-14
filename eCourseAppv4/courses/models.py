from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField

class User(AbstractUser):
    pass
class Category(models.Model):
    name= models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class BaseModel(models.Model):
    create_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True

class Courses(BaseModel):
    name = models.CharField(max_length=255)
    description = RichTextField()
    image = CloudinaryField()
    category = models.ForeignKey(Category, on_delete=models.PROTECT)

    def __str__(self):
        return self.name

class lesson(BaseModel):
    subject = models.CharField(max_length=255)
    course= models.ForeignKey(Courses, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('subject', 'course')
# Create your models here.
