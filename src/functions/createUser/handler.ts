// TODO RDS Proxyの動作確認用
import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJsonResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { createConnection, Connection } from 'mysql2/promise';

import defaultRequestHeader from '@constants/defaultRequestHeader';
import defaultPathParams from '@constants/defaultPathParams';
import defaultQueryParams from '@constants/defaultQueryParams';

import requestBody from './requestBody';

let connection: Connection;

const createMysqlConnection = (): Promise<Connection> => {
  return createConnection({
    host: process.env.DB_WRITER_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
};

const createUserHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof defaultRequestHeader,
  typeof requestBody,
  typeof defaultPathParams,
  typeof defaultQueryParams
> = async (event) => {
  try {
    connection = await createMysqlConnection();
  } catch (error) {
    const response = {
      statusCode: 500,
      body: {
        code: 'DB_ERROR',
        message: 'DB接続に失敗しました。',
      },
    };

    return formatJsonResponse(500, response.body);
  }

  try {
    const request = event.body;

    const sql = 'SELECT * FROM users';

    const [rows] = await connection.execute(sql);

    const response = {
      statusCode: 200,
      body: {
        request,
        users: rows,
      },
    };

    return formatJsonResponse(200, response.body);
  } catch (error) {
    const response = {
      statusCode: 500,
      body: {
        code: 'DB_ERROR',
        message: 'DB接続に失敗しました。',
      },
    };

    return formatJsonResponse(500, response.body);
  } finally {
    await connection.end();
  }
};

export const main = middyfy(createUserHandler);
