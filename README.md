# aws-serverless-node-api-boilerplate

[![ci](https://github.com/nekochans/aws-serverless-node-api-boilerplate/actions/workflows/ci.yml/badge.svg)](https://github.com/nekochans/aws-serverless-node-api-boilerplate/actions/workflows/ci.yml)
[![cd-development](https://github.com/nekochans/aws-serverless-node-api-boilerplate/actions/workflows/cd-development.yml/badge.svg)](https://github.com/nekochans/aws-serverless-node-api-boilerplate/actions/workflows/cd-development.yml)

AWS上でServerlessなAPIを作成する際のboilerplate（Node.jsを利用）

## Getting Started

### Node.jsのインストール

`package.json` の `engines.node` に記載されているバージョンを利用して下さい。

複数プロジェクトで異なるNode.jsのバージョンを利用する可能性があるので、Node.js自体をバージョン管理出来るようにしておくのが無難です。

以下は [nodenv](https://github.com/nodenv/nodenv) を使った設定例です。

```bash
nodenv install 14.15.0

nodenv local 14.15.0
```

### 依存packageのインストール

`node -v` で目的のバージョンが表示されるようになったら、以下を実行して下さい。

`npm install -g yarn` で `yarn` をインストールします。

`yarn install` で依存packageをインストールします。

### 環境変数の設定

環境変数の設定を行います。

[direnv](https://github.com/direnv/direnv) 等の利用を推奨します。

設定が必要な環境変数は下記の通りです。

```
export DEPLOY_STAGE=デプロイ先のステージを設定します。 .e.g dev, stg, prod
export AWS_PROFILE=利用するAWSプロファイル名を設定します。 FYI: https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/cli-configure-profiles.html
export DB_WRITER_HOSTNAME=RDS Proxyのエンドポイントを設定します。
export DB_READER_HOSTNAME=RDS Proxyの読み取り専用エンドポイントを設定します。
export DB_USERNAME=RDS Proxyに接続する為のユーザー名を設定します。
export DB_PASSWORD=Proxyに接続する為のパスワードを設定します。
export DB_NAME=利用するDB名を設定します。
export DATABASE_URL=PrismaのデータソースURLを設定します。このプロジェクトではMySQLを仕様しているのでMySQLのフォーマットを設定します。 FYI: https://www.prisma.io/docs/concepts/database-connectors/mysql
export TEST_DB_HOST=docker-compose.ymlのservicesからmysqlコンテナのサービス名を設定します。
export TEST_DB_USER=テスト用のDBユーザー名を設定します。 docker/mysql/initial.sql を参照。
export TEST_DB_PASSWORD=テスト用のDBパスワードを設定します。 docker/mysql/initial.sql を参照。
export TEST_DB_NAME=テスト用のDB名を設定します。 docker/mysql/initial.sql を参照。
export TEST_DATABASE_URL=テスト用のPrismaのデータソースURLを設定します。
export SECURITY_GROUP_ID=Lambda関数に設定するAWSセキュリティグループを設定します。
export SUBNET_ID_1=Lambda関数に設定するサブネットIDの1つ目を設定します。
export SUBNET_ID_2=Lambda関数に設定するサブネットIDの2つ目を設定します。
export SUBNET_ID_3=Lambda関数に設定するサブネットIDの3つ目を設定します。
```

### 環境構築

`docker-compose up -d` でコンテナを起動します。

### Migrationの実行

`./migrate_up.sh` を実行します。

Migrationのロールバックを行う際は `./migrate_down.sh` を実行します。

## APIを追加する具体的な手順

多少、型定義のカスタマイズを行っていますが、基本的には [Serverlessの公式テンプレート](https://github.com/serverless/serverless/tree/master/lib/plugins/create/templates/aws-nodejs-typescript) がベースになっています。

### `functions/[API名]/handler.ts` の作成

`src/functions/` にAPI名のディレクトリを作成します。

API名はキャメルケースで命名します。

`src/functions/[API名]/handler.ts` という名前のファイルを作成します。

この中に `[API名]Handler` という命名規則で関数を定義します。

ここがLambda関数のエントリーポイントになります。

### `functions/○○/index.ts` の作成

`functions/[API名]/index.ts` を作成します。

handler関数の定義や、Lambda関数のevents定義を記載します。

`src/functions/createUser/index.ts` 等の既存ファイルを参照して下さい。

### `src/functions/[API名]/` にリクエストパラメータ用のファイルを作成

APIのパラメータの受け取り方に応じて、以下のファイルを作成します。

| 作成するファイル名 | 説明                                                                      |
|--------------------|---------------------------------------------------------------------------|
| requestHeader.ts   | 独自のHTTPHeaderを受け取る場合はこのファイルを作成し型定義をします。      |
| requestBody.ts     | リクエストBodyを受け取る場合はこのファイルを作成し型定義をします。        |
| pathParams.ts      | URLのパスでパラメータを受け取る場合はこのファイルを作成し型定義をします。 |
| queryParams.ts     | クエリパラメータを受け取る場合はこのファイルを作成し型定義をします。      |

1つのAPIがHTTPHeader、リクエストBody、パスパラメータ、クエリパラメータの全てを受け取るケースは少ないと思います。

その場合は `src/constants/default○○.ts` を利用して下さい。

これらの型定義を行う事でLambdaのeventオブジェクトから型安全を確保しつつ、各パラメータを取り出す事が可能になります。
