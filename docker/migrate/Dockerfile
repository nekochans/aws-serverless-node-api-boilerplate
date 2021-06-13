FROM golang:1.16-alpine3.12

LABEL maintainer="https://github.com/nekochans"

WORKDIR /go/app

COPY . .

RUN set -eux && \
  apk update && \
  apk add --no-cache git curl make && \
  go install -tags 'mysql' github.com/golang-migrate/migrate/v4/cmd/migrate@v4.14.1

ENV GO111MODULE=off

RUN go get -u github.com/go-sql-driver/mysql

ENV GO111MODULE on
