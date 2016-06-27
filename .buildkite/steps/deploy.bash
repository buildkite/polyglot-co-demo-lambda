#!/bin/bash

set -euo pipefail

echo "--- :lock: Setting up configs"

cat << EOF > env.json
{
  "FORECAST_API_KEY": "${FORECAST_API_KEY}",
  "BUILDKITE_BUILD_NUMBER": "${BUILDKITE_BUILD_NUMBER}",
  "DEBUG": "lambda:*"
}
EOF

cat << EOF > project.json
{
  "name": "polyglot-co-weather",
  "memory": 128,
  "timeout": 5,
  "role": "${APEX_ROLE}"
}
EOF

echo "+++ :lambda: Deploying"

export AWS_REGION="${APEX_REGION}"

apex deploy --env-file env.json
