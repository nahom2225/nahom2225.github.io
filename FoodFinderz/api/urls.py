from django.urls import path
from .views import*
from django.contrib.auth import views as auth_views
from django.contrib.auth.views import LoginView
from django.contrib.auth.decorators import login_required


urlpatterns = [
    path('create-account', CreateAccountView.as_view()),
    path('all-accounts', AccountView.as_view()),
    path('login', LoginAccountView.as_view(), name = "login"),
    path('get-account', GetAccount.as_view()),
    path('logout/', MyLogoutView.as_view(), name='logout'),
    path('account-in-session', AccountInSession.as_view())                                                                                                                                                                          
]


