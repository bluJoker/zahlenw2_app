from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.conf import settings
from django.core.cache import cache

class MultiPlayer(AsyncWebsocketConsumer):
    async def connect(self): # 处理前端发来的创建wss连接消息
        self.room_name = None

        # 找到一个可用房间
        for i in range(1000):
            name = "room-%d" % (i)
            if not cache.has_key(name) or len(cache.get(name)) < settings.ROOM_CAPACITY:
                self.room_name = name
                break

        if not self.room_name: # 房间不够了
            return

        await self.accept()
        print('accept')
        # 接受ws连接后创建该房间
        if not cache.has_key(self.room_name):
            cache.set(self.room_name, [], 3600) # 每局有效期1小时

        # 某用户连接后，server需要向其发送已有玩家信息
        for player in cache.get(self.room_name):
            await self.send(text_data=json.dumps({ # dumps: 将字典转为字符串
                'event': "create_player",
                'uuid': player['uuid'],
                'username': player['username'],
                'photo': player['photo'],
            }))

        await self.channel_layer.group_add(self.room_name, self.channel_name)

    async def disconnect(self, close_code):
        print('disconnect')
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def create_player(self, data):
        players = cache.get(self.room_name)
        players.append({
            'uuid': data['uuid'],
            'username': data['username'],
            'photo': data['photo'],
        })
        cache.set(self.room_name, players, 3600)

        # 群发消息
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': "group_create_player", # 收到群发消息后的处理函数
                'event': "create_player",
                'uuid': data['uuid'],
                'username': data['username'],
                'photo': data['photo'],
            }
        )

    async def group_create_player(self, data):
        await self.send(text_data=json.dumps(data)) # 发送给前端

    async def receive(self, text_data): # 处理收到前端发送的请求消息
        data = json.loads(text_data)
        print("consumers-receive", data)
        event = data['event']
        if event == "create_player":
            await self.create_player(data)
