#!/bin/sh
migrate -source file://./migrations -database $MIGRATION_DSN up

migrate -source file://./migrations -database $MIGRATION_TEST_DSN up
