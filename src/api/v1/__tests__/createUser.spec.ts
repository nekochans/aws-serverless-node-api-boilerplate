import createUser from '../createUser';
import { PrismaClient } from '@prisma/client';

describe('createUser', () => {
  beforeEach(async () => {
    const prisma = new PrismaClient();

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

  it.skip('will create a new user, Only the required parameters are specified', async () => {
    const request = {
      email: 'aaa@exmple.com',
    };

    const expected = {
      statusCode: 201,
      body: {
        user: {
          id: 1,
        },
      },
    };

    const actual = await createUser(request);

    expect(actual).toStrictEqual(expected);
  });

  it.skip('will create a new user, specifying all parameters', async () => {
    const request = {
      email: 'bbb@exmple.com',
      phoneNumber: '08012345678',
    };

    const expected = {
      statusCode: 201,
      body: {
        user: {
          id: 1,
        },
      },
    };

    const actual = await createUser(request);

    expect(actual).toStrictEqual(expected);
  });

  it.skip('should return a validation error', async () => {
    const request = {
      email: '12345678',
    };

    const expected = {
      statusCode: 422,
      body: {
        message: `Unprocessable Entity`,
        validationErrors: [
          { key: 'email', reason: 'must match format "email"' },
        ],
      },
    };

    const actual = await createUser(request);

    expect(actual).toStrictEqual(expected);
  });
});
