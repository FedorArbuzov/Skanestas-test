import time
import redis
import random

import logging

r = redis.Redis(host='redis', port=6379, db=0)

def main():
    while True:
        r.publish('test', str(random.randint(0, 100)))
        print('publish')
        time.sleep(1)

if __name__ == '__main__':
    main()