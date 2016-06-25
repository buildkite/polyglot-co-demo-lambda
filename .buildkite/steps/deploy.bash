#!/bin/bash

set -euo pipefail

echo "--- :lock: Setting up configs"

cat EOF > env.json
{
  "FORECAST_API_KEY": "${FORECAST_API_KEY}"
}
EOF

cat EOF > project.json
{
  "name": "polyglot-co-weather",
  "memory": 128,
  "timeout": 5,
  "role": "${APEX_ROLE}"
}
EOF

echo "--- :apex: Building zip for debugging"

apex build > /src/build.zip
ls -la /src/build.zip

echo "--- :lambda: Deploying"

apex deploy --env-file env.json
