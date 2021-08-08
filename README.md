# 9447-Team1

COMP9447 Team 1 Repo

# Use Case 2: SlackBot

1. SlackBot is added to the target channel.
2. Developer uses AddSec tool to augment their pipeline.
3. New pipeline has a github action that will send data to the SlackBot which has been identified by its unique token.
4. Developer starts the pipeline, security tests are run and reports are generated.
5. Pipeline finishes, links to reports are bundled into a message which is sent to Slack.
6. Developers only need to keep their Slack window open to both be notified when the pipeline is finished and to get access to their multiple security reports.

# Use Case 3: Dynamic PR Environment
1. Clone the repository locally.
2. "website" folder has the website that gets deployed to aws.
3. Add malicious code to test.py in /website.
4. Commit and push the changes.
5. Create a pull request with label "PR-Deploy".
6. This will trigger the workflows which will scan your code using aws codeguru and deploy the website using AWS CDK.
7. After the workflows end , you will get a Deployment URL and codeguru scan results in the PR section (Scan results in "Changes" tab).
8. Merge or CLose the Pull Request , this will trigger the clean-up workflow which will clear all the aws resources and take down the website.

# Use Case 4: NIX Reproducible Builds

1. Developer creates .nix file containing base docker image and all project dependencies
2. Image containing the application with a fixed set of reproducible dependencies is built automatically during a pipeline stage
3. Image is scanned using Snyk
4. Image is stored on ECR
5. Application is deployed on ECS
