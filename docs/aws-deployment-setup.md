# Setting up Polyglot Co Lambda Demo

The following steps are what’s required to setup the Lambda pipeline so it can automatically deploy after it passes its tests.

## Lambda logs policy + roles

Apex sets up these for you automatically via the cli when you create a new project, but we'll create them manually.

Create a policy named `lambda-logs` with:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogStreams"
    ],
    "Resource": [
      "arn:aws:logs:*:*:*"
    ]
  }
 ]
}
```

Now create a Lambda Service role named `lambda` with the `lambda-logs` policy attached.

Take note of the ARN of the role for the following steps.

## Agent permission to update lambda

For agent to be able to deploy and update Lambda via Apex you'll need to add the following inline policy permission to the elastic stack agent role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:*"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:PassRole"
      ],
      "Resource": [
        "<arn-of-the-lamdba-role>"
      ]
    }
  ]
}
```

## Upload the pipeline environment hook to S3

For the deploy pipeline to work it needs some secrets exposed using the pipeline’s environment hook (which as standard in Buildkite AWS Elastic Stack is autoloaded from `s3://the-stack-secret-bucket/pipeline-slug/env`).

For the deploy pipeline you need to expose some config and secrets in the environment hook. You can do this by uploading the following file to the secrets bucket at `/lambda-deploy/env`, substituting in real values for the keys:

```bash
#!/bin/bash

export APEX_ROLE="<arn-of-the-lamdba-role>"
export APEX_REGION="<lambda-region-to-deploy-to>"
export FORECAST_API_KEY="<api-key>"
```

## Test the Lambda pipeline

Create a build on the Lambda pipeline and watch the CI and deploy happen :tada:

## Setup an API Gateway

The simplest way to create an API Gateway is to find the Lambda function that was created in the deploy, go to Triggers, Add Trigger, choose API Gateway, choose `Method: POST`, `Security: Open`, and hit Submit.

Edit the `Integration Request` of the API Gateway POST method execution you just created, and add the following body mapping for type `application/json`:

```json
{
  "locations": "$input.params('locations')"
}
```

You can then run a test with the following request body:

```json
{
  "locations":[
    {
      "lat":"1.3521",
      "lng":"103.8198"
    }
  ]
}
```

If all is well, record the `Invoke URL` for the `POST` (e.g. `https://cbz123.execute-api.ap-southeast-2.amazonaws.com/prod/polyglot-co-weather_fetchWeather`) as you'll need to configure the backend to use this API Gateway.

## All done!

The lambda side is all done—you've now got a continuously tested and deployed set of Lambda functions.
