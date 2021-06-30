# aws-serverless-node-api-boilerplate

[![ci](https://github.com/nekochans/aws-serverless-node-api-boilerplate/actions/workflows/ci.yml/badge.svg)](https://github.com/nekochans/aws-serverless-node-api-boilerplate/actions/workflows/ci.yml)
[![cd-development](https://github.com/nekochans/aws-serverless-node-api-boilerplate/actions/workflows/cd-development.yml/badge.svg)](https://github.com/nekochans/aws-serverless-node-api-boilerplate/actions/workflows/cd-development.yml)

AWS 上で Serverless な API を作成する際の boilerplate（Node.js を利用）

## Getting Started

### Node.js のインストール

`package.json` の `engines.node` に記載されているバージョンを利用して下さい。

複数プロジェクトで異なる Node.js のバージョンを利用する可能性があるので、Node.js 自体をバージョン管理出来るようにしておくのが無難です。

以下は [nodenv](https://github.com/nodenv/nodenv) を使った設定例です。

```bash
nodenv install 14.15.0

nodenv local 14.15.0
```

### 依存 package のインストール

`node -v` で目的のバージョンが表示されるようになったら、以下を実行して下さい。

`npm ci` で依存 package をインストールします。

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

### Migration の実行

`./migrate_up.sh` を実行します。

Migration のロールバックを行う際は `./migrate_down.sh` を実行します。

### Prisma Client の生成

`npm run prisma:generate` を実行します。

## API を追加する具体的な手順

多少、型定義のカスタマイズを行っていますが、基本的には [Serverless の公式テンプレート](https://github.com/serverless/serverless/tree/master/lib/plugins/create/templates/aws-nodejs-typescript) がベースになっています。

### `functions/[API名]/handler.ts` の作成

`src/functions/` に API 名のディレクトリを作成します。

API 名はキャメルケースで命名します。

`src/functions/[API名]/handler.ts` という名前のファイルを作成します。

この中に `[API名]Handler` という命名規則で関数を定義します。

ここが Lambda 関数のエントリーポイントになります。

### `functions/○○/index.ts` の作成

`functions/[API名]/index.ts` を作成します。

handler 関数の定義や、Lambda 関数の events 定義を記載します。

`src/functions/createUser/index.ts` 等の既存ファイルを参照して下さい。

### `src/functions/[API名]/` にリクエストパラメータ用のファイルを作成

API のパラメータの受け取り方に応じて、以下のファイルを作成します。

| 作成するファイル名 | 説明                                                                       |
| ------------------ | -------------------------------------------------------------------------- |
| requestHeader.ts   | 独自の HTTPHeader を受け取る場合はこのファイルを作成し型定義をします。     |
| requestBody.ts     | リクエスト Body を受け取る場合はこのファイルを作成し型定義をします。       |
| pathParams.ts      | URL のパスでパラメータを受け取る場合はこのファイルを作成し型定義をします。 |
| queryParams.ts     | クエリパラメータを受け取る場合はこのファイルを作成し型定義をします。       |

1 つの API が HTTPHeader、リクエスト Body、パスパラメータ、クエリパラメータの全てを受け取るケースは少ないと思います。

その場合は `src/constants/default○○.ts` を利用して下さい。

これらの型定義を行う事で Lambda の event オブジェクトから型安全を確保しつつ、各パラメータを取り出す事が可能になります。

### `src/api/v1/[API名].ts` に API の関数を作成する

ここで作成する関数が最も重要です。

作り方に大きな制約はありませんが、いくつかルールを設けてあります。

ちなみに `v1` とバージョンが定義されていますが `v2` にバージョンアップする際は API の破壊的な変更があった際に限ります。

`v1.1` のような細かいバージョン定義は考慮されていません。

#### 1. `src/functions/[API名]/handler.ts` にロジックが入り込まないように必要な情報を全て返す事

HTTP ステータスコードやレスポンス Body、レスポンスヘッダー等の必要な情報を全て返して下さい。

handler 関数内（`src/functions/[API名]/handler.ts`） ではこの関数のレスポンスを返すだけという状態にする為です。

その為、例外が発生した際も、例外を `Promise.reject()` で返すのではなく、どのようなエラーが発生したかの情報をまとめて、 `Promise.resolve` でレスポンスを返すようにします。

必要に応じて `src/api/domain/` に任意のファイルを作成して下さい。

どのような物を `src/api/domain/` に入れるかのルールはありませんが、複数の API で利用するビジネスロジック上重要な型定義等が `src/api/domain/` に実装されていく事になります。

#### 2. バリデーションエラーの発生時は専用のレスポンスを返す

HTTP ステータスコードは `422` で以下のようにバリデーションエラーになったキー名が分かるようにエラーを返します。

```json
{
  "message": "Unprocessable Entity",
  "validationErrors": [
    {
      "key": "name",
      "reason": "must NOT have more than 8 characters"
    },
    {
      "key": "status",
      "reason": "must be <= 1"
    }
  ]
}
```

これを実現する為には `src/api/validate.ts` を利用します。

仕組みを簡単に説明すると、JSON Schema の仕組みを利用してバリデーションを行っています。

JSON Schema の定義は `src/functions/[API名]` 配下でも利用するので `src/api/domain/types/schemas/` に定義して下さい。

#### 3. DB や外部 API に接続する場合は Repository パターンを利用する

これらのケースに該当する場合は直接関数を定義しないで、 `src/api/repositories/interfaces/` に関数の型定義を行います。

この型定義を利用して、 `src/api/repositories/implements/○○/` に型定義を満たす関数を実装します。

`○○` の部分には依存している外部ライブラリ名が入ります。

例えば以下のような形です。

- [axios](https://github.com/axios/axios) を使って外部 API に通信する場合は `src/api/repositories/implements/axios/` に定義
- [prisma](https://www.prisma.io/) を使って DB に接続する場合は `src/api/repositories/implements/prisma/` に定義

`○○` の部分に依存している外部ライブラリ名を入れる理由は他のライブラリに乗り換えた際の工数を最小限に抑える為です。

Repository パターンを利用した関数を利用する側は必ず `implements` ではなく `interfaces` に依存するように実装する事が大切になってきます。

## Migration の追加手順

### 1. Migration ファイルの追加

DB 用のライブラリとして [Prisma](https://www.prisma.io/) を利用しています、このライブラリには Migration 機能が実装されています。

しかし本プロジェクトでは Migration をツールは [migrate](https://github.com/golang-migrate/migrate) を利用します。

`create_new_migration_file.sh` を利用すると、空の Migration ファイルを作成出来ますので、そこに SQL を書いていきます。

`create_new_migration_file.sh` に渡す引数ですが、命名規則は以下のような形になっています。

- `create_[テーブル名]`
- `add_column_[追加するカラム名]`
- `add_index_[追加するカラム名]`

実行例は以下の通りです。

```bash
./create_new_migration_file.sh add_column_to_users_status

# これらのファイルが作成される
created ./migrations/20210627224719_add_column_to_users_status.up.sql
created ./migrations/20210627224719_add_column_to_users_status.up.sql
```

### 2. Migration の実行を行う

`./migrate_up.sh` を実行して Migration を実行します。

### 3. Prisma Client の再構築

`npm run prisma:introspect` を実行して `prisma/schema.prisma` に新しいテーブル構造を取り込みます。

その後で `prisma:generate` を実行して Prisma Client を再構築します。

これで Prisma で新しいテーブルにアクセスが可能になります。

### AWS 上での Migration について

AWS の CodeBuild で行っています。

以下が CodeBuild の設定ファイルです。

- `buildspec-migrate-up.yml`
- `buildspec-migrate-down.yml`

## テストコードの実装方針

テスト対象の関数が格納されているディレクトリに `__tests__` ディレクトリを作成しその中にテストコードを実装します。

最も重要なのは `src/api/v1/` 配下の API ロジック関数のテストです。

この部分のテストをしっかりと書いておくと、内部構造のリファクタリングが比較的容易に行う事が出来るので、API 関数のテストは必ず実装します。

他の部分に関しては任意ですが、ロジックが複雑で呼び出される回数が多いのであればテストコードの追加を検討しても良いでしょう。

全ての関数に単体テストを実装するのは、テストコードによって開発工数が増大し逆にリファクタリングを阻害する要因になるので、あまりオススメ出来ません。

テストコードの実行は `npm run test` で行います。

## デプロイについて

GitHub Actions で自動でデプロイが行われます。

このプロジェクトは boilerplate なので単一環境にしかデプロイを行っていませんが、ワークフローと環境変数を追加する事で複数の環境へのデプロイが可能です。
