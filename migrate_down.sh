#!/bin/sh
docker-compose exec -T migrate make migrate-down-test-db
