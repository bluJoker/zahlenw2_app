from django.http import JsonResponse
from django.contrib.auth import authenticate, login


def signin(request):
    data = request.GET
    username = data.get('username')
    password = data.get('password')
    user = authenticate(username=username, password=password) # 验证用户名密码api
    if not user:
        return JsonResponse({
            'result': "用户名或密码不正确"
        })
    login(request, user) # 存数据库api
    return JsonResponse({
        'result': "success"
    })

