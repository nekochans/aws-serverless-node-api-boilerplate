#!/bin/sh
docker-compose exec -T migrate migrate -source file://./migrations -database $MIGRATION_DSN up

docker-compose exec -T migrate migrate -source file://./migrations -database $MIGRATION_TEST_DSN up
