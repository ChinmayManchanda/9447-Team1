from aws_cdk import (
    core as cdk,
    aws_s3 as s3,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_s3_deployment as s3Deployment,
)

# For consistency with other languages, `cdk` is the preferred import name for
# the CDK's core module.  The following line also imports it as `core` for use
# with examples from the CDK Developer's Guide, which are in the process of
# being updated to use `cdk`.  You may delete this import if you don't need it.
from aws_cdk import core


class PythonPrStack(cdk.Stack):

    def __init__(self, scope: cdk.Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # The code that defines your stack goes here
        # S3 bucket
        bucket = s3.Bucket(self , "codeguru-reviewer-pr" ,  removal_policy=cdk.RemovalPolicy.DESTROY, auto_delete_objects=True)

        # CloudFront distribution
        source_config = cloudfront.BehaviorOptions(
            origin=origins.S3Origin(bucket= bucket,) , 
            viewer_protocol_policy= cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        )
        distribution = cloudfront.Distribution(self , "Distribution" , default_behavior = source_config , default_root_object= "index.html",)

        # Output the distribution's url so we can pass it to external systems
        core.CfnOutput(self, "DeploymentUrl" , value="https://" + distribution.distribution_domain_name)

        # Upload our build to the bucket and invalidate the distribution's cache
        s3Deployment.BucketDeployment(self , "BucketDeployment" , destination_bucket= bucket , distribution=distribution , distribution_paths= ["/", "/index.html"], sources=[s3Deployment.Source.asset('./website')],)

