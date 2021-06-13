FROM ubuntu:20.04

WORKDIR /migrate/app

RUN set -eux
RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y curl gnupg2 vim default-mysql-client
RUN curl -L https://github.com/golang-migrate/migrate/releases/download/v4.14.1/migrate.linux-amd64.tar.gz | tar xvz
RUN mv ./migrate.linux-amd64 /usr/bin/migrate
