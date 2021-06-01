import { HttpStatusCode } from '@constants/httpStatusCode';

export type SuccessResponse<T> = {
  statusCode: HttpStatusCode;
  body: T;
};

export const createSuccessResponse = <T>(
  statusCode: HttpStatusCode,
  body: T,
): SuccessResponse<T> => {
  return {
    statusCode,
    body,
  };
};

export type ErrorResponse<T, U> = {
  statusCode: HttpStatusCode;
  body: {
    code: T;
    message: U;
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
