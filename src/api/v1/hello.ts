import {
  SuccessResponse,
  ErrorResponse,
  ValidationErrorResponse,
  createSuccessResponse,
  createErrorResponse,
} from '../response';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { valueOf } from '../utils/valueOf';
import validate from '../validate';

type Request = {
  name: string;
  status: number;
};

type ResponseBody = {
  message: string;
};

export type HelloSuccessResponse = SuccessResponse<ResponseBody>;

export type Errors = {
  notAllowedMessage: 'message is not allowed';
};

type ErrorCode = keyof Errors;
type ErrorMessage = valueOf<Errors>;

export type HelloErrorResponse = ErrorResponse<ErrorCode, ErrorMessage>;

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 4,
      maxLength: 8,
    },
    status: {
      type: 'number',
      minimum: 1,
      maximum: 1,
    },
  },
  required: ['name', 'status'],
  additionalProperties: false,
};

export const hello = (
  request: Request,
): HelloSuccessResponse | HelloErrorResponse | ValidationErrorResponse => {
  const validateResult = validate<Request>(schema, request);
  if (
    validateResult.isError === true &&
    validateResult.validationErrorResponse
  ) {
    return validateResult.validationErrorResponse;
  }

  if (request.name === 'Error') {
    return createErrorResponse<ErrorCode, ErrorMessage>({
      statusCode: HttpStatusCode.badRequest,
      errorCode: 'notAllowedMessage',
      errorMessage: 'message is not allowed',
    });
  }

  return createSuccessResponse<ResponseBody>({
    statusCode: HttpStatusCode.ok,
    body: {
      message: `Hello ${request.name}, welcome to the exciting Serverless world! Your Status is ${request.status}!`,
    },
  });
};

export default hello;
