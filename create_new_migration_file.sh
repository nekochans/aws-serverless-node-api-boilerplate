#!/bin/sh

if [ "$1" = "" ]; then
  echo  "第1引数にMigrationFileのタイトルを指定して下さい。"
  echo "FYI: https://github.com/golang-migrate/migrate/blob/master/MIGRATIONS.md"
  exit 1
fi

title=$1

version=`date "+%Y%m%d%H%M%S"`

up_file=${version}_${title}.up.sql
down_file=${version}_${title}.down.sql

touch ./migrations/${up_file}
touch ./migrations/${down_file}

echo created ./migrations/${up_file}
echo created ./migrations/${up_file}
