#!/bin/bash

set -euo pipefail

echo "--- :s3: Retrieving configs"

aws s3 cp "s3://${S3_PROD_BUCKET_NAME}/env.json" env.json
aws s3 cp "s3://${S3_PROD_BUCKET_NAME}/project.json" project.json

echo "--- :apex: Building zip"

docker-compose run node npm run build

ls -la build.zip

echo "--- :lambda: Deploying"

docker-compose run --rm \
  -e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" \
  -e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" \
  -e "AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}" \
  node npm run deploy
