# 9447-Team1

COMP9447 Team 1 Repo

# Use Case 1: AddSec
AddSec's configuration details could be found here: https://github.com/TirthParikh27/AddSec 

# Use Case 2: SlackBot

1. Slack App (CodeBuild-Bot) is added to the slack channel.
2. "slackapi/slack-github-action@v1.14.0" action is added to the workflow.
3. "channel-id" field need to be changed to the slack channel id from slack.
4. Custom message can be inserted in the "slack-message" section. 
5. SLACK_BOT_TOKEN needs to be added to git secrets.

# Use Case 3: PR Environment

PR Environment's configuration details could be found here: https://github.com/TirthParikh27/Python_PR

# Use Case 4: NIX Reproducible Builds

1. Developer creates .nix file containing base docker image and all project dependencies
2. Image containing the application with a fixed set of reproducible dependencies is built automatically during a pipeline stage
3. Image is scanned using Snyk
4. Image is stored on ECR
5. Application is deployed on ECS

# Additional Tools (Pre-commit hooks)

1. Add the required workflow actions to .pre-commit-config.yaml
2. Follow these steps on your local machine

```bash
$ pip install pre-commit
$ pre-commit install
$ pre-commit run --all-files
```
# NOTES

We didn't use CFN so getting the handle-slack-command lambda function to work for you will not be entirely simple. This lambda function was from a use case that focused on AWS CodeCommit / CodeBuild and was discarded due to taking lots of time to work on, but offering lackluster security improvements.

1. You will need to make a new API that can trigger the lambda function
2. You will have to add the TOKEN from CodeBuild Bot to your AWS secrets manager (So the API security works)

There is an additional feature we can't add to the repo that used AWS Macie, AWS Code Pipeline and AWS SNS Topics to send messages to Slack when a Pipeline failed.
