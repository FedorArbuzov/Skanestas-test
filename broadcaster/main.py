import redis
import asyncio
import websockets

redis_url = 'redis://redis:6379/0'
channel = 'test'

connection = redis.StrictRedis.from_url(redis_url, decode_responses=True)

pubsub = connection.pubsub(ignore_subscribe_messages=False)
pubsub.subscribe(channel)

CONNECTIONS = set()

async def register(websocket):
    CONNECTIONS.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        CONNECTIONS.remove(websocket)

async def show_time():
    for item in pubsub.listen():
        message = item['data']
        if type(message) != int:
            print(message)
            websockets.broadcast(CONNECTIONS, message)
        await asyncio.sleep(0.2)

async def main():
    async with websockets.serve(register, "0.0.0.0", 5679):
        await show_time()


if __name__ == "__main__":
    print("Started")
    asyncio.run(main())