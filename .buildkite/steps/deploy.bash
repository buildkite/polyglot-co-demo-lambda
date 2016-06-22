#!/bin/bash

set -euo pipefail

echo "--- :s3: Retrieving configs"

aws s3 cp "${S3_URL_APEX_PROD_ENV_JSON}" env.json
aws s3 cp "${S3_URL_APEX_PROD_PROJECT_JSON}" project.json

echo "--- :apex: Building zip for debugging"

apex build > /src/build.zip
ls -la /src/build.zip

echo "--- :lambda: Deploying"

apex deploy --env-file env.json
