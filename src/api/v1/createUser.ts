import { PrismaClient } from '@prisma/client';

import {
  SuccessResponse,
  ErrorResponse,
  ValidationErrorResponse,
  createSuccessResponse,
  createErrorResponse,
  createDefaultResponseHeaders,
} from '../response';

import { UserEntity } from '../domain/types/userEntity';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { valueOf } from '../utils/valueOf';
import validate from '../validate';
import { UserSchema } from '../domain/types/schemas/userSchema';
import { createNewUser } from '../repositories/implements/prisma/user';
import { CreateNewUserErrorMessage } from '../repositories/errors/createNewUserError';
import assertNever from '../utils/assertNever';
import { DefaultApiRequest } from '../request';
import { RequestSchema } from '../domain/types/schemas/requestSchema';

type Request = DefaultApiRequest & {
  email: string;
  phoneNumber?: string;
};

type ResponseBody = {
  user: UserEntity;
};

export type CreateUserSuccessResponse = SuccessResponse<ResponseBody>;

type Errors = {
  emailAlreadyRegistered: 'email is already registered';
  dbError: 'error in database';
};

type ErrorCode = keyof Errors;
type ErrorMessage = valueOf<Errors>;

export type CreateUserErrorResponse = ErrorResponse<ErrorCode, ErrorMessage>;

const schema = {
  type: 'object',
  properties: {
    email: UserSchema.email,
    phoneNumber: UserSchema.phoneNumber,
    'x-request-id': RequestSchema['x-request-id'],
  },
  required: ['email'],
  additionalProperties: false,
};

export const createUser = async (
  request: Request,
  prisma: PrismaClient,
): Promise<
  CreateUserSuccessResponse | CreateUserErrorResponse | ValidationErrorResponse
> => {
  try {
    const validateResult = validate<Request>(schema, request);
    if (
      validateResult.isError === true &&
      validateResult.validationErrorResponse
    ) {
      return validateResult.validationErrorResponse;
    }

    const createNewUserResponse = await createNewUser(prisma, request);

    if (
      createNewUserResponse.isSuccessful === false &&
      createNewUserResponse.error
    ) {
      const errorMessage = createNewUserResponse.error
        .message as CreateNewUserErrorMessage;
      switch (errorMessage) {
        case 'emailAlreadyRegisteredError':
          return createErrorResponse<ErrorCode, ErrorMessage>({
            statusCode: HttpStatusCode.badRequest,
            errorCode: 'emailAlreadyRegistered',
            errorMessage: 'email is already registered',
            headers: createDefaultResponseHeaders(request['x-request-id']),
          });
        case 'unexpectedError':
          return createErrorResponse<ErrorCode, ErrorMessage>({
            statusCode: HttpStatusCode.internalServerError,
            errorCode: 'dbError',
            errorMessage: 'error in database',
            headers: createDefaultResponseHeaders(request['x-request-id']),
          });
        default:
          assertNever(errorMessage);
      }
    }

    return createSuccessResponse<ResponseBody>({
      statusCode: HttpStatusCode.created,
      body: { user: createNewUserResponse.userEntity },
      headers: createDefaultResponseHeaders(request['x-request-id']),
    });
  } catch (error) {
    return createErrorResponse<ErrorCode, ErrorMessage>({
      statusCode: HttpStatusCode.internalServerError,
      errorCode: 'dbError',
      errorMessage: 'error in database',
      headers: createDefaultResponseHeaders(request['x-request-id']),
    });
  } finally {
    await prisma.$disconnect();
  }
};

export default createUser;
