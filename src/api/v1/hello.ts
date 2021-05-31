import Ajv from 'ajv';
import {
  SuccessResponse,
  ErrorResponse,
  ValidationErrorResponse,
} from '../Response';
import { HttpStatusCode } from '@constants/HttpStatusCode';

type Request = {
  name: string;
  status: number;
};

type SayHelloSuccessResponse = SuccessResponse<{ message: string }>;

type ErrorCode = 'NotAllowedMessage';

type ErrorMessage = 'NotAllowedMessage';

type SayHelloErrorResponse = ErrorResponse<ErrorCode, ErrorMessage>;

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

const ajv = new Ajv({ allErrors: true });

const validate = ajv.compile(schema);

export const hello = (
  request: Request,
):
  | SayHelloSuccessResponse
  | SayHelloErrorResponse
  | ValidationErrorResponse => {
  const valid = validate(request);

  if (!valid) {
    const validationErrors = validate.errors.map((value) => {
      return {
        key: value.instancePath.replace('/', ''),
        reason: value.message,
      };
    });

    return {
      statusCode: HttpStatusCode.unprocessableEntity,
      body: {
        message: 'Unprocessable Entity',
        validationErrors,
      },
    };
  }

  if (request.name === 'Error') {
    return {
      statusCode: HttpStatusCode.badRequest,
      body: {
        code: 'NotAllowedMessage',
        message: 'NotAllowedMessage',
      },
    };
  }

  return {
    statusCode: HttpStatusCode.ok,
    body: {
      message: `Hello ${request.name}, welcome to the exciting Serverless world! Your Status is ${request.status}!`,
    },
  };
};

export default hello;
