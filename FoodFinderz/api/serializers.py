from rest_framework import serializers
from .models import Account

#Takes models with all python related code, and translates to a JSON resposne
#Takes keys turns to strings

        
class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'

class CreateAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('username', 'password', 'account_id')

class LoginAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('username', 'password')


        
