import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {
  SuccessResponse,
  ErrorResponse,
  ValidationErrorResponse,
} from '../Response';

type Request = {
  email: string;
};

type createUserSuccessResponse = SuccessResponse<{ user: { id: number } }>;

type ErrorCode = 'EmailAlreadyRegistered';

type ErrorMessage = 'Email address is already registered';

type createUserErrorResponse = ErrorResponse<ErrorCode, ErrorMessage>;

const schema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      maxLength: 254,
    },
  },
  required: ['email'],
  additionalProperties: false,
};

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(schema);

export const createUser = (
  request: Request,
):
  | createUserSuccessResponse
  | createUserErrorResponse
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
      statusCode: 422,
      body: {
        message: 'Unprocessable Entity',
        validationErrors,
      },
    };
  }

  return {
    statusCode: 201,
    body: {
      user: {
        id: 1,
      },
    },
  };
};

export default createUser;
