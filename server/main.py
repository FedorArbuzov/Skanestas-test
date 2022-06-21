import json

import psycopg2
from flask import Flask, Response, request
from flask_cors import CORS

conn = psycopg2.connect(dbname='de1p2j5p2km2h6', user='kwxssaupxgrrgb', 
                        password='626bb561ad0e823838556918f92bb1eb1d9e8ff5273dcfa62726f103744027f6', host='ec2-54-74-35-87.eu-west-1.compute.amazonaws.com')
conn.autocommit = True
cursor = conn.cursor()


app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    ticker = request.args.get('ticker')
    cursor.execute(f"select * from prices where ticker={ticker};")
    return Response(json.dumps(list(cursor), default=str),  mimetype='application/json')

if __name__ == '__main__':
    app.run()