# 9447-Team1

COMP9447 Team 1 Repo

# Use Case 2: SlackBot

1. Slack App (CodeBuild-Bot) is added to the slack channel.
2. "slackapi/slack-github-action@v1.14.0" action is added to the workflow.
3. "channel-id" field need to be changed to the slack channel id from slack.
4. Custom message can be inserted in the "slack-message" section. 
5. SLACK_BOT_TOKEN needs to be added to git secrets.

# Use Case 4: NIX Reproducible Builds

1. Developer creates .nix file containing base docker image and all project dependencies
2. Image containing the application with a fixed set of reproducible dependencies is built automatically during a pipeline stage
3. Image is scanned using Snyk
4. Image is stored on ECR
5. Application is deployed on ECS
