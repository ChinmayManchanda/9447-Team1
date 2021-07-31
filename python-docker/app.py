from flask import Flask
import pydoc
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, Docker!'
