import createUser from '../createUser';

describe('createUser', () => {
  it('should return a new user', async () => {
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

  it('should return a validation error', async () => {
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
