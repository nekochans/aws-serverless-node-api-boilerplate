import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import {
  SuccessResponse,
  ErrorResponse,
  ValidationErrorResponse,
} from '../Response';

type Request = {
  email: string;
  phoneNumber?: string;
};

type ResponseBody = {
  user: { id: number };
};

type CreateUserSuccessResponse = SuccessResponse<ResponseBody>;

type ErrorCode = 'EmailAlreadyRegistered';

type ErrorMessage = 'Email address is already registered';

type CreateUserErrorResponse = ErrorResponse<ErrorCode, ErrorMessage>;

const schema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      maxLength: 254,
    },
    phoneNumber: {
      type: 'string',
      minLength: 10,
      maxLength: 11,
    },
  },
  required: ['email'],
  additionalProperties: false,
};

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(schema);

export const createUser = async (
  request: Request,
): Promise<
  CreateUserSuccessResponse | CreateUserErrorResponse | ValidationErrorResponse
> => {
  try {
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

    await prisma.users.create(createDbParams(request));

    return {
      statusCode: 201,
      body: {
        user: {
          id: 1,
        },
      },
    };
  } catch (error) {
    // TODO エラーメッセージが適当なので後で直す
    return {
      statusCode: 500,
      body: {
        code: 'EmailAlreadyRegistered',
        message: 'Email address is already registered',
      },
    };
  } finally {
    await prisma.$disconnect();
  }
};

const createDbParams = (request: Request) => {
  const params = {
    data: {
      users_emails: {
        create: { email: request.email },
      },
    },
  };

  if (request.phoneNumber !== undefined) {
    params.data['users_phone_numbers'] = {
      create: [{ phone_number: request.phoneNumber }],
    };
  }

  return params;
};

export default createUser;
