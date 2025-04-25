#!/bin/bash

# Configuration
GITLAB_REGISTRY="git.hw.ag:5050"
PROJECT_PATH="ai/hw-chatbot"

# Exit on error
set -e

echo "🔑 Logging into GitLab registry..."
docker login $GITLAB_REGISTRY

echo "⬆️ Pushing base image..."
docker push $GITLAB_REGISTRY/$PROJECT_PATH/base:latest
echo "⬆️ Pushing rag image..."
docker push $GITLAB_REGISTRY/$PROJECT_PATH/rag:latest
echo "⬆️ Pushing gpu image..."
docker push $GITLAB_REGISTRY/$PROJECT_PATH/gpu:latest

echo "✅ All images built and pushed successfully!"