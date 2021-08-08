import json
import base64
import boto3
import time
import ast

from botocore.exceptions import ClientError

def lambda_handler(event, context):
    
    secret_name = "slack_token"
    region_name = "us-east-2"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    # In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
    # See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    # We rethrow the exception by default.

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        if e.response['Error']['Code'] == 'DecryptionFailureException':
            # Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InternalServiceErrorException':
            # An error occurred on the server side.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidParameterException':
            # You provided an invalid value for a parameter.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidRequestException':
            # You provided a parameter value that is not valid for the current state of the resource.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'ResourceNotFoundException':
            # We can't find the resource that you asked for.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
    else:
        # Decrypts secret using the associated KMS CMK.
        # Depending on whether the secret is a string or binary, one of these fields will be populated.
        if 'SecretString' in get_secret_value_response:
            secret = get_secret_value_response['SecretString']
        else:
            decoded_binary_secret = base64.b64decode(get_secret_value_response['SecretBinary'])
    
    
    
    token = ''
    pipeline_id = ''
    
    
    # print(event)
    
    client = boto3.client('codepipeline')
    
    # Get base64-encoded body message
    encoded_body = event['body']
    
    # Decode to text
    body = str(base64.b64decode(encoded_body))
    
    # Parse pipeline id
    params = body.split('&')
    
    #Extract token from body and compare to token in secrets return 403 if they dont match
    #Extract pipeline_id
    for param in params:
        if 'token' in param:
            token = param.split('=')[1]
        
        if 'text' in param:
            pipeline_id = param.split('=')[1]
            
    #convert the string dictionary into a real dictionary wowowow this had me confused
    #for so long debugging
    secret = ast.literal_eval(secret)
    
    #If token does not matched key in aws secrets then do not authourize
    if token != secret["slack-token"]:
        return {
            'statusCode': 403,
            'body': json.dumps('Invalid authentication token')
        }
            
    pipeline_name = "MythicalMysfitsServiceCICDPipeline"
    
    commit_id = client.get_pipeline_execution(
        pipelineName=pipeline_name,
        pipelineExecutionId=pipeline_id
    )['pipelineExecution']['artifactRevisions'][0]['revisionId']
    
    # print(commit_id)
    
    branch_name = f'{commit_id}-fix_{int(time.time())}'
    
    codecommit_client = boto3.client('codecommit')
    codecommit_client.create_branch(
        repositoryName = "MythicalMysfitsService-Repository",
        branchName = branch_name,
        commitId = commit_id
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps(f'Branch created ({branch_name})! You are awesome!')
    }
