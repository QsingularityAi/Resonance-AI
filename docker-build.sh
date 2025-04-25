#!/bin/bash

# Configuration
GITLAB_REGISTRY="git.hw.ag:5050"
PROJECT_PATH="ai/hw-chatbot"

# Exit on error
set -e

echo "🔑 Logging into GitLab registry..."
docker login $GITLAB_REGISTRY

# Build and push base image
echo "🏗️ Building base image..."
docker build --target xbase \
    -t $GITLAB_REGISTRY/$PROJECT_PATH/base:latest \
    .

# Build and push rag image
echo "🏗️ Building rag image..."
docker build --target xrag \
    -t $GITLAB_REGISTRY/$PROJECT_PATH/rag:latest \
    .

# Build and push gpu image
echo "🏗️ Building gpu image..."
docker build --target xgpu \
    -t $GITLAB_REGISTRY/$PROJECT_PATH/gpu:latest \
    .


