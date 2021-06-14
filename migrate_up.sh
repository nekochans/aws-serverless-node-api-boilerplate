#!/bin/sh
docker-compose exec -T migrate make migrate-up-test-db
