import createUser, {
  CreateUserErrorResponse,
  CreateUserSuccessResponse,
} from '../createUser';
import { PrismaClient } from '@prisma/client';
import {
  ValidationErrorResponse,
  validationErrorResponseMessage,
} from '../../response';
import { HttpStatusCode } from '@constants/httpStatusCode';
import * as response from '../../response';

describe('createUser', () => {
  let prisma: PrismaClient;
  let responseSpy;
  const fakeRequestId = 'aaaaaaaa-bbbbbbbbb-123-ddddddddddddd';

  beforeEach(async () => {
    responseSpy = jest
      .spyOn(response, 'createDefaultResponseHeaders')
      .mockReturnValue({
        'content-type': 'application/json',
        'x-request-id': fakeRequestId,
      });
    prisma = new PrismaClient();

    try {
      await prisma.$queryRaw('SET FOREIGN_KEY_CHECKS=0');
      await prisma.$queryRaw('TRUNCATE TABLE users_phone_numbers');
      await prisma.$queryRaw('TRUNCATE TABLE users_emails');
      await prisma.$queryRaw('TRUNCATE TABLE users');
      await prisma.$queryRaw('SET FOREIGN_KEY_CHECKS=1');
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  });

  afterEach(() => {
    responseSpy.mockRestore();
  });

  it('will create a new user, Only the required parameters are specified', async () => {
    const request = {
      email: 'aaa@exmple.com',
    };

    const expected: CreateUserSuccessResponse = {
      statusCode: HttpStatusCode.created,
      body: {
        user: {
          id: 1,
          email: {
            id: 1,
            email: request.email,
          },
        },
      },
      headers: {
        'content-type': 'application/json',
        'x-request-id': fakeRequestId,
      },
    };

    const actual = await createUser(request, prisma);

    expect(actual).toStrictEqual(expected);
    expect(responseSpy).toHaveBeenCalled();
  });

  it('will create a new user, specifying all parameters', async () => {
    const request = {
      email: 'bbb@exmple.com',
      phoneNumber: '08012345678',
    };

    const expected: CreateUserSuccessResponse = {
      statusCode: HttpStatusCode.created,
      body: {
        user: {
          id: 1,
          email: {
            id: 1,
            email: request.email,
          },
          phoneNumbers: [{ id: 1, phoneNumber: request.phoneNumber }],
        },
      },
      headers: {
        'content-type': 'application/json',
        'x-request-id': fakeRequestId,
      },
    };

    const actual = await createUser(request, prisma);

    expect(actual).toStrictEqual(expected);
    expect(responseSpy).toHaveBeenCalled();
  });

  it('should return a email already registered error', async () => {
    const request = {
      email: 'ccc@exmple.com',
    };

    const expected: CreateUserErrorResponse = {
      statusCode: HttpStatusCode.badRequest,
      body: {
        code: 'emailAlreadyRegistered',
        message: `email is already registered`,
      },
      headers: {
        'content-type': 'application/json',
        'x-request-id': fakeRequestId,
      },
    };

    await createUser(request, prisma);

    const actual = await createUser(request, prisma);

    expect(actual).toStrictEqual(expected);
    expect(responseSpy).toHaveBeenCalled();
  });

  it('should return a validation error', async () => {
    const request = {
      email: '12345678',
    };

    const expected: ValidationErrorResponse = {
      statusCode: HttpStatusCode.unprocessableEntity,
      body: {
        message: validationErrorResponseMessage(),
        validationErrors: [
          { key: 'email', reason: 'must match format "email"' },
        ],
      },
      headers: {
        'content-type': 'application/json',
        'x-request-id': fakeRequestId,
      },
    };

    const actual = await createUser(request, prisma);

    expect(actual).toStrictEqual(expected);
    expect(responseSpy).toHaveBeenCalled();
  });
});
