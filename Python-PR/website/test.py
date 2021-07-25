from flask import Flask
from urllib3 import request
import subprocess

app = Flask(__name__)

def execute(cmd):
  try:
    retcode = subprocess.call(cmd, shell=True)
  except OSError as e:
    pass
  
@app.route('/')
def hello_world():
  return 'Hello, World!'

@app.route("/dns")
def page():
  hostname = request.values.get(hostname)
  cmd = 'nslookup ' + hostname

  return subprocess.check_output(cmd, shell=True)