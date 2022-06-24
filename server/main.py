import json

import psycopg2
from flask import Flask, Response, request
from flask_cors import CORS

conn = psycopg2.connect(dbname='app', user='postgres', 
                        password='postgres', host='postgres')
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
    app.run(host='0.0.0.0', port=5000)