import createUser, {
  CreateUserErrorResponse,
  CreateUserSuccessResponse,
} from '../createUser';
import { PrismaClient } from '@prisma/client';
import { ValidationErrorResponse } from '../../Response';

describe.skip('createUser', () => {
  let prisma: PrismaClient;

  beforeEach(async () => {
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

  it('will create a new user, Only the required parameters are specified', async () => {
    const request = {
      email: 'aaa@exmple.com',
    };

    const expected: CreateUserSuccessResponse = {
      statusCode: 201,
      body: {
        user: {
          id: 1,
          email: {
            id: 1,
            email: request.email,
          },
        },
      },
    };

    const actual = await createUser(request, prisma);

    expect(actual).toStrictEqual(expected);
  });

  it('will create a new user, specifying all parameters', async () => {
    const request = {
      email: 'bbb@exmple.com',
      phoneNumber: '08012345678',
    };

    const expected: CreateUserSuccessResponse = {
      statusCode: 201,
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
    };

    const actual = await createUser(request, prisma);

    expect(actual).toStrictEqual(expected);
  });

  it('should return a email already registered error', async () => {
    const request = {
      email: 'ccc@exmple.com',
    };

    const expected: CreateUserErrorResponse = {
      statusCode: 400,
      body: {
        code: 'EmailAlreadyRegistered',
        message: `Email address is already registered`,
      },
    };

    await createUser(request, prisma);

    const actual = await createUser(request, prisma);

    expect(actual).toStrictEqual(expected);
  });

  it('should return a validation error', async () => {
    const request = {
      email: '12345678',
    };

    const expected: ValidationErrorResponse = {
      statusCode: 422,
      body: {
        message: `Unprocessable Entity`,
        validationErrors: [
          { key: 'email', reason: 'must match format "email"' },
        ],
      },
    };

    const actual = await createUser(request, prisma);

    expect(actual).toStrictEqual(expected);
  });
});
