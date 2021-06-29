import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJsonResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import defaultPathParams from '@constants/defaultPathParams';
import defaultQueryParams from '@constants/defaultQueryParams';

import requestHeader from './requestHeader';
import requestBody from './requestBody';
import hello, { Request } from '../../api/v1/hello';
import { createApiRequest } from '../../api/request';

const helloHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof requestHeader,
  typeof requestBody,
  typeof defaultPathParams,
  typeof defaultQueryParams
> = async (event) => {
  const request = createApiRequest<Request>(event.headers, event.body);

  const response = hello(request);

  return formatJsonResponse(
    response.statusCode,
    response.body,
    response.headers,
  );
};

export const main = middyfy(helloHandler);
