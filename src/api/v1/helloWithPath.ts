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
  helloId: string;
};

type ResponseBody = {
  message: string;
};

export type HelloWithPathSuccessResponse = SuccessResponse<ResponseBody>;

export type Errors = {
  notAllowedHelloId: 'helloId is not allowed';
};

type ErrorCode = keyof Errors;
type ErrorMessage = valueOf<Errors>;

export type HelloWithPathErrorResponse = ErrorResponse<ErrorCode, ErrorMessage>;

const schema = {
  type: 'object',
  properties: {
    helloId: {
      type: 'string',
      minLength: 4,
      maxLength: 8,
    },
  },
  required: ['helloId'],
  additionalProperties: false,
};

export const helloWithPath = (
  request: Request,
):
  | HelloWithPathSuccessResponse
  | HelloWithPathErrorResponse
  | ValidationErrorResponse => {
  const validateResult = validate<Request>(schema, request);
  if (
    validateResult.isError === true &&
    validateResult.validationErrorResponse
  ) {
    return validateResult.validationErrorResponse;
  }

  if (request.helloId === 'Error') {
    return createErrorResponse<ErrorCode, ErrorMessage>({
      statusCode: HttpStatusCode.badRequest,
      errorCode: 'notAllowedHelloId',
      errorMessage: 'helloId is not allowed',
    });
  }

  return createSuccessResponse<ResponseBody>({
    statusCode: HttpStatusCode.ok,
    body: {
      message: `HelloWithPath ${request.helloId}, welcome to the exciting Serverless world!`,
    },
  });
};

export default helloWithPath;
