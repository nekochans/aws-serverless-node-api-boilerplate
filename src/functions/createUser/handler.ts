// TODO RDS Proxyの動作確認用
import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJsonResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import { PrismaClient } from '@prisma/client';

import defaultRequestHeader from '@constants/defaultRequestHeader';
import defaultPathParams from '@constants/defaultPathParams';
import defaultQueryParams from '@constants/defaultQueryParams';

import requestBody from './requestBody';
import createUser, { Request } from '../../api/v1/createUser';
import { createApiRequest } from '../../api/request';

const prisma = new PrismaClient({ log: ['query', 'info', `warn`, `error`] });

const createUserHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof defaultRequestHeader,
  typeof requestBody,
  typeof defaultPathParams,
  typeof defaultQueryParams
> = async (event) => {
  const request = createApiRequest<Request>(event.headers, event.body);

  const response = await createUser(request, prisma);

  return formatJsonResponse(
    response.statusCode,
    response.body,
    response.headers,
  );
};

export const main = middyfy(createUserHandler);
