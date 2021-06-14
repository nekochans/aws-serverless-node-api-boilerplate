FROM migrate/migrate:v4.14.1

LABEL maintainer="https://github.com/nekochans"

WORKDIR /opt/app

COPY . .

RUN set -eux && \
  apk update && \
  apk add --no-cache make

ENTRYPOINT []

CMD tail -f /dev/null
