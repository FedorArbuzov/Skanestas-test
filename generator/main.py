import time
import json
from random import random
from datetime import datetime

import redis
import psycopg2
from psycopg2 import sql

conn = psycopg2.connect(dbname='de1p2j5p2km2h6', user='kwxssaupxgrrgb', 
                        password='626bb561ad0e823838556918f92bb1eb1d9e8ff5273dcfa62726f103744027f6', host='ec2-54-74-35-87.eu-west-1.compute.amazonaws.com')
conn.autocommit = True
cursor = conn.cursor()
cursor.execute("drop table prices;")

r = redis.Redis(host='localhost', port=6379, db=0)


def insert_new_prices_chunk(values):
    insert = sql.SQL('INSERT INTO prices (ticker, price, time) VALUES {}').format(
        sql.SQL(',').join(map(sql.Literal, values))
    )
    cursor.execute(insert)

def get_initial_data():
    cursor.execute("select * from information_schema.tables where table_name=%s", ('prices',))
    if bool(cursor.rowcount):
        cursor.execute("select * from prices where time = (select max(time) from prices);")
        return list(cursor)
    cursor.execute("CREATE TABLE prices (ticker integer, price integer, time timestamp);")
    dt = datetime.now().replace(microsecond=0)
    data = [(idx, 0, dt) for idx in range(100)]
    insert_new_prices_chunk(data)
    return data

def generate_movement():
    movement = -1 if random() < 0.5 else 1
    return movement

def main():
    data = get_initial_data()
    while True:
        dt = datetime.now().replace(microsecond=0)
        data = [(idx, price + generate_movement(), dt) for idx, price, _ in data]
        insert_new_prices_chunk(data)
        r.publish('test', json.dumps(data, default=str))
        print('publish')
        time.sleep(1)

if __name__ == '__main__':
    main()