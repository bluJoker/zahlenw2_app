from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    line1='<h1 style="text-align:center">Dota2</h1>'
    line2='<img src="https://img.dota2.com.cn/dota2static/file/e1b72511-af28-4233-839f-4b93e64566f3.jpg" style="width:1100;position:absolute;left:20%;top:12%;margin-left:-60px;margin-top:-20px;">'
    return HttpResponse(line1 + line2)
