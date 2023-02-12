from django.db import models
import string
import random
from datetime import timezone, datetime
from django.contrib.auth.models import AbstractUser, Group, Permission

# Create your models here.
#Every model has a primary key, the id, it is a unique integer
#that can identify a model in relation to all other models 

def generate_unique_id():
    length = 15
    while True:
        account_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
        if Account.objects.filter(account_id=account_id).count() == 0:
            break
    return account_id

def generate_unique_post_id():
    length = 15
    while True:
        account_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
        if Post.objects.filter(account_id=account_id).count() == 0:
            break
    return account_id

# Create your models here.
class Account(AbstractUser):
    current_session = models.CharField(max_length=50, default = "")
    account_id = models.CharField(max_length = 15, default=generate_unique_id)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(auto_now_add=True)
    groups = models.ManyToManyField(
        Group,
        related_name='account_groups',
        blank=True,
        help_text = (
            'The groups this user belongs to. A user will get all permissions granted to each of their groups.'
        ),
        related_query_name='user',
    )

    user_permissions = models.ManyToManyField(
        Permission,
        related_name='account_permissions',
        blank=True,
        help_text=('Specific permissions for this user.'),
        related_query_name='user',
    )

class Tags(models.Model):
    tag = models.CharField(max_length=50, default = "")

class Post(models.Model):
    title = models.CharField(max_length=50, default = "")
    food = models.CharField(max_length=50, default = "")
    current_session = models.CharField(max_length=50, default = "")
    description = models.CharField(max_length=2000, default = "")
    account_poster = models.ForeignKey(Account, on_delete=models.CASCADE)
    tags = models.ManyToManyField(Tags)
    upvotes = models.IntegerField(null=False, default=0)
    downvotes = models.IntegerField(null=False, default=0)




    