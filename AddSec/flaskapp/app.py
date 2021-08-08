import os
from flask import Flask, flash, request, redirect, url_for, session
from flask import jsonify
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import logging
import yaml
import json
import time
from autoGit import cloneGit, pushGit, getRepo
import ruamel.yaml
from pathlib import Path


yaml = ruamel.yaml.YAML()
yaml.indent(mapping=2, sequence=4, offset=2)
yaml.preserve_quotes = True

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger('HELLO WORLD')

UPLOAD_FOLDER = '.'
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif','yml'])

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = os.urandom(24)

# file name of uploaded workflow
filename = ''
# input json
file_dict = {}
# store position of commit, build, deploy stages
pos = {}
# steps
steps = []
# steps with visibility
updated_steps = []
# tools
tools_list = ['CodeGuru', 'ZAP', 'Snyk']
tools_type = ['SAST', 'DAST', 'Compliance']
# secure pipeline dict
secure_flow = {}
# repo folder
repo_folder = 'ClonedRepo'
# sonar variables
sonar_organization=""
sonar_projectKey=""

# hide unnecessary steps in the ui
def checkVisible(step):
    black_list = ['checkout', 'slug']
    for word in black_list:
        try:
            if step['name'] != None:
                if word in step['name']:
                    return False
            if step['uses'] != None:
                if word in step['name']:
                    return False
            if step['run'] != None:
                if word in step['run']:
                    return False
        except:
            continue
    return True

# @app.route('/upload', methods=['POST'])
# def fileUpload():
#     global filename
#     target=os.path.join(UPLOAD_FOLDER,'test_docs')
#     if not os.path.isdir(target):
#         os.mkdir(target)
#     logger.info("welcome to upload`")
#     file = request.files['file']
#     filename = secure_filename(file.filename)
#     print(filename)
#     destination="/".join([target, filename])
#     file.save(destination)
#     session['uploadFilePath']=destination
#     response={"res" : "Successfully uploaded"}
#     return response

# get step names from workflow yaml
@app.route('/getNames')
def names():
    global file_dict
    global updated_steps
    global filename
    if len(updated_steps)==0:
        # TODO
        try:
            file_path = Path("{}/.github/workflows/{}".format(repo_folder,filename))
            with open(file_path) as f:
            # with open('{}/.github/workflows/{}'.format(repo_folder,filename)) as f:
                # file_dict = yaml.safe_load(f)
                file_dict = yaml.load(f)
        except:
            # with open("/home/mukulsharma/Desktop/UNSW/COMP9447/AddSec/flaskapp/ClonedRepo/.github/workflows/pipeline.yml") as f:
            #     # file_dict = yaml.safe_load(f)
            #     file_dict = yaml.load(f)
            with open(os.path.abspath(os.getcwd())+"/ClonedRepo/.github/workflows/"+filename) as f:
                file_dict = yaml.load(f)

        tmp_dict = {"on" if k == True else k:v for k,v in file_dict.items()}
        file_dict = tmp_dict
        steps = file_dict['jobs']['deploy']['steps']
        print(file_dict)
        for s in steps:
            s['visible'] = checkVisible(s)
            updated_steps.append(s)
    print("Returned step names")
    return jsonify(updated_steps)

# return the names of all steps and pos of tools
@app.route('/getNamesPos')
def namePos():
    global updated_steps
    return {'steps':updated_steps, 'pos':pos}

# return list of tools and type
@app.route('/getToolNames')
def toolNames():
    global tools_list
    global tools_type
    res = []
    for i in range(len(tools_list)):
        res.append(tools_list[i]+'('+tools_type[i]+')')
    print("Returned tool names")
    return jsonify(res)

# post the index of stages
@app.route('/setStagePos', methods=['POST'])
def setPos():
    global pos
    data = request.get_json()
    pos = data.get('pos','')
    response={"res" : "Successfully stored positions"}
    print("Successfully stored positions")
    return response

# make the changes to the pipeline
# {'id':{'data':{'label'}}}
@app.route('/setToolNames', methods=['POST'])
def makeSecure():
    global secure_flow
    global file_dict
    global repo_folder
    global filename
    tmp_pos_dict = {}
    tool_pos_dict = {}
    step_list = []
    data_received = request.get_json()
    # check if we want slack
    slack_enable = data_received['slack']
    # all the security tools and location
    data = data_received['steps']
    # adding precommit hooks, check is we watn them
    pre_enable = data_received['pre_commit']

    if pre_enable:
        # include precommit file
        file_path = Path("ClonedRepo/.pre-commit-config.yaml")
        json_data = {}

        with open("tools/pre_commit.json") as ff:
            json_data = json.load(ff)
        f = open(file_path, "w")
        print('herheheheheheh')
        # os.system("touch ClonedRepo/.pre-commit-config.yaml")
        # f = open(file_path, "w")
        yaml.dump(json_data, f)

    for row in data:
        try:
            if 'dndnode' in row['id']:
                try:
                    tmp_pos_dict[row['id']]=row['data']['label']
                except:
                    continue
        except:
            continue
    for t in tmp_pos_dict:
        for r in data:
            try:
                if t == r['source']:
                    tool_pos_dict[r['target']] = tmp_pos_dict[t]
                elif t == r['target']:
                    tool_pos_dict[r['source']] = tmp_pos_dict[t]
            except:
                continue
    for i in data:
        try:
            if isinstance(int(i['id']), int):
                step_list.append(i['data']['label'])
            else:
                continue
            if i['id'] in tool_pos_dict:
                step_list.append(tool_pos_dict[i['id']])
        except:
            continue

    steps = file_dict['jobs']['deploy']['steps']
    l = []
    names = []

    for i in steps:
        l.append(i)
        names.append(i['name'])

    for j, s in enumerate(step_list):
        if s not in names:
            inlist = step_list[j-1]
            if 'codeguru' in s.lower():
                file_path = Path("tools/codeguru_1.json")
                with open(file_path, 'r') as f:
                # with open('tools/codeguru_1.json', 'r') as f:
                    json_data = {}
                    json_data = json.load(f)
                    l.insert(names.index(inlist)+1,json_data)
                file_path = Path("tools/codeguru_2.json")

                with open(file_path, 'r') as f:
                # with open('tools/codeguru_2.json', 'r') as f:
                    json_data = {}
                    json_data = json.load(f)
                    l.insert(names.index(inlist)+2,json_data)
                ind = names.index(inlist)+1
                names.insert(ind, 'code')
                ind = names.index(inlist)+1
                names.insert(ind, 'guru')

            elif 'zap' in s.lower():
                file_path = "tools/zap.json"
                with open(file_path, 'r') as f:
                # with open('tools/zap.json', 'r') as f:
                    json_data = json.load(f)
                    l.insert(names.index(inlist)+1,json_data)
                    ind = names.index(inlist)+1
                    names.insert(ind, 'zappppp')
            elif 'docker' in s.lower():
                file_path = "ClonedRepo/snyk.sarif"
                with open(file_path, 'w') as f:
                # with open('ClonedRepo/snyk.sarif', 'w') as f:
                    pass
                file_path = "tools/snyk_1.json"
                with open(file_path, 'r') as f:
                # with open('tools/snyk_1.json', 'r') as f:
                    json_data = json.load(f)
                    l.insert(names.index(inlist)+1,json_data)
                file_path = "tools/snyk_2.json"
                # with open('tools/snyk_2.json', 'r') as f:
                with open(file_path, 'r') as f:
                    json_data = json.load(f)
                    l.insert(names.index(inlist)+2, json_data)
                ind = names.index(inlist)+1
                names.insert(ind, 'doc')
                ind = names.index(inlist)+1
                names.insert(ind, 'ker')
            elif 'sonarcloud' in s.lower():
                file_path = Path("ClonedRepo/sonar-project.properties")
                # with open('ClonedRepo/sonar-project.properties', 'w') as f:
                with open(file_path, 'w') as f:
                    f.write("sonar.organization={}\nsonar.projectKey={}\nsonar.sources=.".format(sonar_organization, sonar_projectKey))
                file_path = Path("tools/sonarcloud.json")
                with open(file_path) as f:
                # with open('tools/sonarcloud.json', 'r') as f:
                    json_data = json.load(f)
                    l.insert(names.index(inlist)+1, json_data)
                    ind = names.index(inlist)+1
                    names.insert(ind, 'sonar')

    # adding slack to the steps
    if slack_enable:
        file_path = Path("tools/slack.yml")
        with open(file_path) as f:
            f_dict = yaml.load(f)
        l.append(f_dict)

    secure_flow = file_dict
    secure_flow['jobs']['deploy']['steps'] = l
    for sf in secure_flow['jobs']['deploy']['steps']:
        try:
            sf.pop('visible')
        except:
            continue
    file_path = Path("{}/.github/workflows/{}".format(repo_folder, filename))
    # f = open('{}/.github/workflows/{}'.format(repo_folder, filename), 'w')
    f = open(file_path, 'w')
    # yaml.dump(secure_flow, f, allow_unicode = True)
    yaml.dump(secure_flow, f)

    # push the changes to git repo
    repo = getRepo(repo_folder)
    #repo.index.add([os.path.abspath(os.getcwd())+'/ClonedRepo/snyk.sarif'])

    pushGit("/"+repo_folder+"/.github/workflows/"+filename, "your pipeline has been secured", repo_folder , ["/ClonedRepo/snyk.sarif", "/ClonedRepo/sonar-project.properties", "/ClonedRepo/.pre-commit-config.yaml"])
    # pushGit(pg, "Your pipeline has been secured", repo_folder, arr)
    response={"res" : "Successfully integrated tools"}
    print("Successfully integrated tools and pushed")
    return response , 200

@app.route('/setConfig', methods=['POST'])
def setConfig():
    data = request.get_json()
    global sonar_projectKey
    global sonar_organization
    sonar_organization = data['orgkey']
    sonar_projectKey = data['projectkey']
    print("Received sonar config variables")
    response={"res" : "Received sonar config variables"}
    return response, 200

@app.route('/setRepo' , methods=['POST'])
def setRepo():
    global filename
    global repo_folder
    data = request.get_json()
    filename = data['filename']
    print(data)
    cloneGit(data['url'], repo_folder)
    response={"res" : "Successfully Found workflow file"}
    print("Successfully Found workflow file")
    return response , 200

if __name__ == "__main__":
    app.run(debug=True,host="0.0.0.0")
