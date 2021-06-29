import {
  SuccessResponse,
  ErrorResponse,
  ValidationErrorResponse,
  createSuccessResponse,
  createErrorResponse,
  createDefaultResponseHeaders,
} from '../response';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { valueOf } from '../utils/valueOf';
import validate from '../validate';
import { HelloSchema } from '../domain/types/schemas/helloSchema';
import { DefaultApiRequest } from '../request';
import { RequestSchema } from '../domain/types/schemas/requestSchema';

type Request = DefaultApiRequest & {
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
    helloId: HelloSchema.helloId,
    'x-request-id': RequestSchema['x-request-id'],
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
      headers: createDefaultResponseHeaders(request['x-request-id']),
    });
  }

  return createSuccessResponse<ResponseBody>({
    statusCode: HttpStatusCode.ok,
    body: {
      message: `HelloWithPath ${request.helloId}, welcome to the exciting Serverless world!`,
    },
    headers: createDefaultResponseHeaders(request['x-request-id']),
  });
};

export default helloWithPath;
