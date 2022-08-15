from django.http import JsonResponse
from django.contrib.auth import login
from django.contrib.auth.models import User
from game.models.player.player import Player

def register(request):
    data = request.GET
    username = data.get("username", "").strip() # strip: 去掉前后空格
    password = data.get("password", "").strip()
    password_confirm = data.get("password_confirm", "").strip()
    if not username or not password:
        return JsonResponse({
            'result': "用户名和密码不能为空"
        })
    if password != password_confirm:
        return JsonResponse({
            'result': "两次密码不一致",
        })
    if User.objects.filter(username=username).exists(): # filter: 查找数据库
        return JsonResponse({
            'result': "用户名已存在"
        })
    user = User(username=username)
    user.set_password(password)
    user.save() # 存入数据库api
    Player.objects.create(user=user, photo="https://gd4.alicdn.com/imgextra/i2/202416743/O1CN01WFApD81zgLR2Us2IX_!!202416743.jpg")
    login(request, user)
    return JsonResponse({
        'result': "success",
    })

