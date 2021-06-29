import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJsonResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import defaultRequestHeader from '@constants/defaultRequestHeader';
import defaultRequestBody from '@constants/defaultRequestBody';
import defaultQueryParams from '@constants/defaultQueryParams';

import pathParams from './pathParams';

import { fetchAddressByPostalCode } from '../../api/repositories/implements/axios/address';
import addressSearch, { Request } from '../../api/v1/addressSearch';
import { createApiRequest } from '../../api/request';

const addressSearchHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof defaultRequestHeader,
  typeof defaultRequestBody,
  typeof pathParams,
  typeof defaultQueryParams
> = async (event) => {
  const request = createApiRequest<Request>(
    event.headers,
    event.pathParameters,
  );

  const response = await addressSearch(request, fetchAddressByPostalCode);

  return formatJsonResponse(
    response.statusCode,
    response.body,
    response.headers,
  );
};

export const main = middyfy(addressSearchHandler);
