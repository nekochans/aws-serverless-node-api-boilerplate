import sayHello from '../sayHello';

describe('sayHello', () => {
  it('should return a success message', () => {
    const request = {
      name: 'Moko',
      status: 1,
    };

    const expected = {
      statusCode: 200,
      body: {
        message: `Hello ${request.name}, welcome to the exciting Serverless world! Your Status is ${request.status}!`,
      },
    };

    expect(sayHello(request)).toStrictEqual(expected);
  });

  it('should return a Error', () => {
    const request = {
      name: 'Error',
      status: 1,
    };

    const expected = {
      statusCode: 400,
      body: {
        code: 'NotAllowedMessage',
        message: 'NotAllowedMessage',
      },
    };

    expect(sayHello(request)).toStrictEqual(expected);
  });

  it('should return a validation error', () => {
    const request = {
      name: 'MokoCatMokoCat',
      status: 10,
    };

    const expected = {
      statusCode: 422,
      body: {
        message: `Unprocessable Entity`,
        validationErrors: [
          { key: 'name', reason: 'must NOT have more than 8 characters' },
          { key: 'status', reason: 'must be <= 1' },
        ],
      },
    };

    expect(sayHello(request)).toStrictEqual(expected);
  });
});
