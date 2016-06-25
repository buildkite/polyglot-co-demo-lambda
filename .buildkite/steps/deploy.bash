#!/bin/bash

set -euo pipefail

echo "--- :s3: Retrieving configs"

aws s3 cp "${APEX_PROD_ENV_JSON_S3_URL}" env.json
aws s3 cp "${APEX_PROD_PROJECT_JSON_S3_URL}" project.json

echo "--- :apex: Building zip for debugging"

apex build > /src/build.zip
ls -la /src/build.zip

echo "--- :lambda: Deploying"

apex deploy --env-file env.json
