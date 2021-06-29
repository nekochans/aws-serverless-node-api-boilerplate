import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJsonResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import defaultRequestHeader from '@constants/defaultRequestHeader';
import defaultRequestBody from '@constants/defaultRequestBody';

import pathParams from './pathParams';
import queryParams from './queryParams';
import helloWithPath from '../../api/v1/helloWithPath';

const helloWithPathHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof defaultRequestHeader,
  typeof defaultRequestBody,
  typeof pathParams,
  typeof queryParams
> = async (event) => {
  const request = event.pathParameters;

  const response = helloWithPath(request);

  return formatJsonResponse(
    response.statusCode,
    response.body,
    response.headers,
  );
};

export const main = middyfy(helloWithPathHandler);
