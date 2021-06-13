FROM golang:1.16-alpine3.12

LABEL maintainer="https://github.com/nekochans"

WORKDIR /migrate/app

COPY . .

RUN set -eux && \
  apk update && \
  apk add --no-cache git curl make && \
  go install -tags 'mysql' github.com/golang-migrate/migrate/v4/cmd/migrate@v4.14.1
