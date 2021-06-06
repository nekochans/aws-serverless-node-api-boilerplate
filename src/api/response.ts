import { HttpStatusCode } from '@constants/httpStatusCode';

export type SuccessResponse<T> = {
  statusCode: HttpStatusCode;
  body: T;
};

export const createSuccessResponse = <T>(params: {
  statusCode: HttpStatusCode;
  body: T;
}): SuccessResponse<T> => {
  return {
    statusCode: params.statusCode,
    body: params.body,
  };
};

export type ErrorResponse<T, U> = {
  statusCode: HttpStatusCode;
  body: {
    code: T;
    message: U;
  };
};

export const createErrorResponse = <T, U>(params: {
  statusCode: HttpStatusCode;
  errorCode: T;
  errorMessage: U;
}): ErrorResponse<T, U> => {
  return {
    statusCode: params.statusCode,
    body: {
      code: params.errorCode,
      message: params.errorMessage,
    },
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
};
