import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJsonResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import defaultPathParams from '@constants/defaultPathParams';
import defaultQueryParams from '@constants/defaultQueryParams';

import requestHeader from './requestHeader';
import requestBody from './requestBody';
import sayHello from '../../api/v1/sayHello';

const hello: ValidatedEventAPIGatewayProxyEvent<
  typeof requestHeader,
  typeof requestBody,
  typeof defaultPathParams,
  typeof defaultQueryParams
> = async (event) => {
  const apiRes = sayHello(event.body);

  return formatJsonResponse(apiRes.statusCode, apiRes.body);
};

export const main = middyfy(hello);
