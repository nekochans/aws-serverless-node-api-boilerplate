import { HttpStatusCode } from '@constants/HttpStatusCode';

export type SuccessResponse<T> = {
  statusCode: HttpStatusCode;
  body: T;
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
