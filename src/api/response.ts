import { HttpStatusCode } from '@constants/httpStatusCode';
import { v4 as uuidv4 } from 'uuid';

export type ResponseHeaders = {
  [header: string]: boolean | number | string;
};

export type DefaultResponseHeaders = {
  'content-type': 'application/json';
  'x-request-id': string;
};

export const createDefaultResponseHeaders = (
  requestId?: string,
): DefaultResponseHeaders => {
  return {
    'content-type': 'application/json',
    'x-request-id': requestId ? requestId : uuidv4(),
  };
};

export type SuccessResponse<T> = {
  statusCode: HttpStatusCode;
  body: T;
  headers: ResponseHeaders;
};

export const createSuccessResponse = <T>(params: {
  statusCode: HttpStatusCode;
  body: T;
  headers: ResponseHeaders;
}): SuccessResponse<T> => {
  return {
    statusCode: params.statusCode,
    body: params.body,
    headers: params.headers,
  };
};

export type ErrorResponse<T, U> = {
  statusCode: HttpStatusCode;
  body: {
    code: T;
    message: U;
  };
  headers: ResponseHeaders;
};

export const createErrorResponse = <T, U>(params: {
  statusCode: HttpStatusCode;
  errorCode: T;
  errorMessage: U;
  headers: ResponseHeaders;
}): ErrorResponse<T, U> => {
  return {
    statusCode: params.statusCode,
    body: {
      code: params.errorCode,
      message: params.errorMessage,
    },
    headers: params.headers,
  };
};

type ValidationErrorResponseMessage = 'Unprocessable Entity';

export const validationErrorResponseMessage =
  (): ValidationErrorResponseMessage => {
    return 'Unprocessable Entity';
  };

export type ValidationErrorResponse = {
  statusCode: typeof HttpStatusCode.unprocessableEntity;
  body: {
    message: ValidationErrorResponseMessage;
    validationErrors: { key: string; reason: string }[];
  };
  headers: ResponseHeaders;
};
