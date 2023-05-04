from django.shortcuts import render
from rest_framework import serializers, renderers
from rest_framework.response import Response 
from rest_framework import generics, status
from .serializers import*
from .models import Account, Post
from rest_framework.views import APIView
from django.http import JsonResponse
from django.utils import timezone
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password
from rest_framework.exceptions import ValidationError
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.core.paginator import Paginator
from rest_framework.renderers import JSONRenderer




# Create your views here.


class AccountView(generics.ListAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

class PostView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer    


class CreateAccountView(APIView):
    serializer_class = CreateAccountSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get('username')
            password = serializer.data.get('password')
            current_session = self.request.session.session_key
            queryset = Account.objects.filter(username=username)
            if queryset.exists():
                return Response({'Bad User' : 'Username Taken'}, status=status.HTTP_409_CONFLICT)
            else:
                hashed_password = make_password(password)
                account = Account(current_session = current_session, username=username, password=hashed_password)
                account.save()
                self.request.session['account_id'] = account.account_id
                return Response(CreateAccountSerializer(account).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_409_CONFLICT)
    
class LoginAccountView(APIView):
    serializer_class = LoginAccountSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            username = serializer.data.get('username')
            password = serializer.data.get('password')
            queryset = Account.objects.filter(username=username)
            if password == '':
                print("1")
                return Response({'error': 'Missing Password'}, status=status.HTTP_400_BAD_REQUEST)
            elif username == '':
                print("2")
                return Response({'error': 'Missing Username'}, status=status.HTTP_400_BAD_REQUEST)
            elif not queryset.exists():
                print("3")
                return Response({'error': 'Invalid Password or Username'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            try:
                serializer.is_valid(raise_exception=True)
            except serializers.ValidationError as e:
                username = serializer.data.get('username')
                password = serializer.data.get('password')
                if 'username' in e.detail and 'already exists' in str(e.detail['username']):
                    queryset = Account.objects.filter(username=username)
                    account = queryset[0]
                    if account.check_password(password):
                        self.request.session['account_id'] = account.account_id
                        account.last_login = timezone.now()
                        account.current_session = self.request.session.session_key
                        account.save(update_fields=['current_session', 'last_login'])
                        return Response(LoginAccountSerializer(account).data, status=status.HTTP_200_OK)
                    elif password == '':
                        print("4")
                        return Response({'error': 'Missing Password'}, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        print("5")
                        return Response({'error': 'Invalid Password or Username'}, status=status.HTTP_401_UNAUTHORIZED)
                elif password == '':
                    print("6")
                    return Response({'error': 'Missing Password'}, status=status.HTTP_400_BAD_REQUEST)
                elif username == '':
                    print("7")
                    return Response({'error': 'Missing Username'}, status=status.HTTP_400_BAD_REQUEST)
        print("HERE2")
        return Response({'error': 'Invalid Data BOOOT'}, status=status.HTTP_400_BAD_REQUEST)
            

class GetAccount(APIView):
    serializer_class = AccountSerializer
    lookup_url_kwarg = 'account_id'

    def get(self, request, format = None):
        account_id = self.request.session['account_id']
        if account_id != None:
            account = Account.objects.filter(account_id=account_id)
            if len(account) > 0:
                data = AccountSerializer(account[0]).data
                return Response(data, status = status.HTTP_200_OK)
            return Response({'Account Not Found': 'Invalid Account Access.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request':'Account Not Found'}, status=status.HTTP_404_NOT_FOUND)

class MyLoginView(LoginView):
    template_name = 'login.html'

class MyLogoutView(APIView):
    #template_name = 'login.html'
    serializer_class = AccountSerializer
    lookup_url_kwarg = 'account_id'

    def get(self, request, format = None):
        accountId = self.request.session[self.lookup_url_kwarg]
        if accountId != None:
            #account = Account.objects.filter(accountId)
            #account.account_id = None
            #account.save(update_fields=['account_id'])
            self.request.session[self.lookup_url_kwarg] = None
            logout(request)
            return redirect('home')
        return Response({'Account Not Found': 'Invalid Account Access.'}, status=status.HTTP_404_NOT_FOUND)
    



def logout_view(request):
    logout(request)
    return redirect('home')

class AccountInSession(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = {
            'account_id': self.request.session.get('account_id')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)
    
class CreatePost(APIView):
    serializer_class = CreatePostSerializer
    
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            queryset = Post.objects.filter(title=serializer.validated_data.get('title'), description=serializer.validated_data.get('description'))
            if queryset.exists():
                return Response({'error': 'Duplicate Post'}, status=status.HTTP_409_CONFLICT)
            else:
                post = serializer.save(posted=True, created_at = timezone.now())
                account_poster = serializer.validated_data.get('account_poster')
                account = Account.objects.get(username=account_poster)
                account.posts.add(post)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'error': 'Missing Information'}, status=status.HTTP_400_BAD_REQUEST)
    
#@api_view(['GET'])
class PostsList(APIView):    

    def get(self, request, page, posts_per_page):
        posts = Post.objects.order_by('-created_at')
        paginator = Paginator(posts, posts_per_page)
        paginated_posts = paginator.get_page(page)
        serializer = PostSerializer(paginated_posts, many=True)
        response_data = {
            'count': posts.count(),
            'results': serializer.data
        }
        return Response(response_data)        

