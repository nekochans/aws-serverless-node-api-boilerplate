.PHONY: migrate-up migrate-up-test-db migrate-down-test-db

migrate-up:
	@migrate -source file://./migrations -database 'mysql://$(DB_USERNAME):$(DB_PASSWORD)@tcp($(DB_HOST):3306)/$(DB_NAME)' up

migrate-up-test-db:
	@migrate -source file://./migrations -database 'mysql://$(TEST_DB_USER):$(TEST_DB_PASSWORD)@tcp($(TEST_DB_HOST):3306)/$(TEST_DB_NAME)' up

migrate-down-test-db:
	@migrate -source file://./migrations -database 'mysql://$(TEST_DB_USER):$(TEST_DB_PASSWORD)@tcp($(TEST_DB_HOST):3306)/$(TEST_DB_NAME)' down
