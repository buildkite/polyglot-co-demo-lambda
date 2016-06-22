# Polyglot Co Lambda Weather

Part of the Polyglot Co Buildkite demo. This demonstrates running build and deploy pipelines for Lambda services using Apex.

## Developing

```bash
# Install deps we don't want to deploy to Lambda
npm install

# Install each function's own runtime deps
for dir in functions/*; do
  pushd "$dir" && npm install && popd
done

# Run the tests for all functions
npm run test
```

Alternatively you can just use Docker Compose:

```bash
docker-compose run node npm run test
```
