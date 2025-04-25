#!/bin/bash

# use: ./docker-prod.sh <docker compos args>. i.e. ./docker-prod.sh up -d
docker-compose -f docker-compose.yml -f docker-compose.prod.yml $@