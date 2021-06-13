FROM migrate/migrate:v4.14.1

WORKDIR /go/app

COPY . .

ENV GO111MODULE=off

RUN set -eux && \
  apk update && \
  go get -u github.com/go-sql-driver/mysql

ENV GO111MODULE on

ENTRYPOINT []

CMD tail -f /dev/null
