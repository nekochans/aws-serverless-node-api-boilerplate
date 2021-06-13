.PHONY: migrate-up

migrate-up:
	@migrate -source file://./migrations -database 'mysql://$(DB_USER):$(DB_PASSWORD)@tcp($(DB_HOST):3306)/$(DB_NAME)' up
	@migrate -source file://./migrations -database 'mysql://$(TEST_DB_USER):$(TEST_DB_PASSWORD)@tcp($(DB_HOST):3306)/$(TEST_DB_NAME)' up
