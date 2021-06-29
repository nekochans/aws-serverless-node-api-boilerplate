import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
  Handler,
} from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { ResponseHeaders } from '../api/response';

type ValidatedAPIGatewayProxyEvent<S, T, U, V> = Omit<
  APIGatewayProxyEventV2,
  'headers' | 'body' | 'pathParameters' | 'queryStringParameters'
> & { headers: FromSchema<S> } & { body: FromSchema<T> } & {
  pathParameters: FromSchema<U>;
} & { queryStringParameters: FromSchema<V> } & { headers: FromSchema<U> };
export type ValidatedEventAPIGatewayProxyEvent<S, T, U, V> = Handler<
  ValidatedAPIGatewayProxyEvent<S, T, U, V>,
  APIGatewayProxyResultV2
>;

export const formatJsonResponse = (
  statusCode: HttpStatusCode,
  responseBody: Record<string, unknown>,
  responseHeaders: ResponseHeaders,
): { statusCode: HttpStatusCode; body: string; headers: ResponseHeaders } => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(responseBody),
    headers: responseHeaders,
  };
};
