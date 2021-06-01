import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { PrismaClient, users } from '@prisma/client';

import {
  SuccessResponse,
  ErrorResponse,
  ValidationErrorResponse,
} from '../Response';

import { UserEntity } from '../domain/types/userEntity';
import { HttpStatusCode } from '@constants/HttpStatusCode';
import { valueOf } from '../utils/valueOf';

type Request = {
  email: string;
  phoneNumber?: string;
};

type ResponseBody = {
  user: UserEntity;
};

type CreateUserSuccessResponse = SuccessResponse<ResponseBody>;

type Errors = {
  EmailAlreadyRegistered: 'Email address is already registered';
};

type ErrorCode = keyof Errors;
type ErrorMessage = valueOf<Errors>;

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
  prisma: PrismaClient,
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
        statusCode: HttpStatusCode.unprocessableEntity,
        body: {
          message: 'Unprocessable Entity',
          validationErrors,
        },
      };
    }

    const user = await prisma.users_emails.findFirst({
      where: {
        email: request.email,
      },
    });

    if (user) {
      return {
        statusCode: HttpStatusCode.badRequest,
        body: {
          code: 'EmailAlreadyRegistered',
          message: 'Email address is already registered',
        },
      };
    }

    const newUser = await prisma.users.create(createUserParams(request));

    const userEntity = await createUserEntity(prisma, newUser);

    return {
      statusCode: HttpStatusCode.created,
      body: {
        user: userEntity,
      },
    };
  } catch (error) {
    // Prismaのエラーオブジェクトは下記のような仕様、これを元に判定する事は出来る
    // https://www.prisma.io/docs/reference/api-reference/error-reference
    if (
      error?.code === 'P2002' &&
      error?.meta?.target === 'uq_users_emails_02'
    ) {
      return {
        statusCode: HttpStatusCode.badRequest,
        body: {
          code: 'EmailAlreadyRegistered',
          message: 'Email address is already registered',
        },
      };
    }

    return {
      statusCode: HttpStatusCode.internalServerError,
      body: {
        code: 'EmailAlreadyRegistered',
        message: 'Email address is already registered',
      },
    };
  } finally {
    await prisma.$disconnect();
  }
};

const createUserParams = (request: Request) => {
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

const createUserEntity = async (prisma: PrismaClient, newUser: users) => {
  const responseData = await prisma.users.findUnique({
    where: {
      id: newUser.id,
    },
    include: {
      users_emails: true,
      users_phone_numbers: true,
    },
  });

  const userEntity = {
    id: responseData.id,
    email: {
      id: responseData.users_emails.id,
      email: responseData.users_emails.email,
    },
  };

  if (responseData.users_phone_numbers.length !== 0) {
    userEntity['phoneNumbers'] = responseData.users_phone_numbers.map(
      (value) => {
        return { id: value.id, phoneNumber: value.phone_number };
      },
    );
  }

  return userEntity;
};

export default createUser;
