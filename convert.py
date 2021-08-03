## convert-os.py
## Import the modules to handle JSON & YAML
import yaml
import json

## Create a variable to hold the data to import
os_list = {}

## Read the YAML file
with open(".pre-commit-config.yaml") as infile:
    os_list = yaml.load(infile, Loader=yaml.FullLoader)     # Print the List to the console. print(os_list)Open a file to write the JSON output. The 'w' makes the file writable
    with open("hooks.json", 'w') as outfile:
        json.dump(os_list, outfile, indent=4)