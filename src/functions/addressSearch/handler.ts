import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJsonResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import defaultRequestHeader from '@constants/defaultRequestHeader';
import defaultRequestBody from '@constants/defaultRequestBody';
import defaultQueryParams from "@constants/defaultQueryParams";

import pathParams from './pathParams';
import addressSearch from "../../api/v1/addressSearch";

const addressSearchHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof defaultRequestHeader,
  typeof defaultRequestBody,
  typeof pathParams,
  typeof defaultQueryParams
> = async (event) => {
  const request = event.pathParameters;

  const response = addressSearch(request);

  return formatJsonResponse(response.statusCode, response.body);
};

export const main = middyfy(addressSearchHandler);
