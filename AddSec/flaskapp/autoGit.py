import git
import os
from pathlib import Path

def cloneGit(url , dirName):
  # Check out via HTTPS
  #repo = git.Repo.clone_from('https://github.com/TirthParikh27/AddSec' , 'AddSec')
  repo = git.Repo.clone_from(url , dirName)
  #repo = git.Repo('AddSec')
  origin = repo.remote("origin")

def pushGit(filePath , msg , dirName , files):
  repo = git.Repo(dirName)
  # Commit
  # repo.index.add([os.path.abspath(os.getcwd())+'\AddSec\demofile.txt'])  # in this case filename would be "/User/some_user/some_dir/demofile.txt"
  for item in files:
    repo.index.add([os.path.abspath(os.getcwd())+item])
  repo.index.add([os.path.abspath(os.getcwd())+filePath])
  #repo.index.commit("Workflow edited - test 3")
  repo.index.commit(msg)
  origin = repo.remote("origin")
  # Push
  repo.git.push("--set-upstream", origin, repo.head.ref)

def getRepo(filePath):
    return git.Repo(filePath)
