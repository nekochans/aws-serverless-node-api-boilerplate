import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJsonResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import defaultRequestHeader from '@constants/defaultRequestHeader';
import defaultRequestBody from '@constants/defaultRequestBody';

import pathParams from './pathParams';
import queryParams from './queryParams';

const helloWithPathHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof defaultRequestHeader,
  typeof defaultRequestBody,
  typeof pathParams,
  typeof queryParams
> = async (event) => {
  const responseBody = {
    message: `HelloWithPath ${event.pathParameters.helloId}, welcome to the exciting Serverless world!`,
    event,
  };

  return formatJsonResponse(200, responseBody);
};

export const main = middyfy(helloWithPathHandler);
