.PHONY: migrate-up-test-db

migrate-up-test-db:
	@migrate -source file://./migrations -database 'mysql://$(TEST_DB_USER):$(TEST_DB_PASSWORD)@tcp($(TEST_DB_HOST):3306)/$(TEST_DB_NAME)' up
