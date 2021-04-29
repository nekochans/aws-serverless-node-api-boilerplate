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

export type ValidationErrorResponse = {
  statusCode: 422;
  body: {
    message: 'Unprocessable Entity';
    validationErrors: { key: string; reason: string }[];
  };
};
