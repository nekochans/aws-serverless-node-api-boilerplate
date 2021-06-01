import hello, {
  SayHelloErrorResponse,
  SayHelloSuccessResponse,
} from '../hello';
import { HttpStatusCode } from '@constants/HttpStatusCode';

describe('hello', () => {
  it('should return a success message', () => {
    const request = {
      name: 'Moko',
      status: 1,
    };

    const expected: SayHelloSuccessResponse = {
      statusCode: HttpStatusCode.ok,
      body: {
        message: `Hello ${request.name}, welcome to the exciting Serverless world! Your Status is ${request.status}!`,
      },
    };

    expect(hello(request)).toStrictEqual(expected);
  });

  it('should return a Error', () => {
    const request = {
      name: 'Error',
      status: 1,
    };

    const expected: SayHelloErrorResponse = {
      statusCode: HttpStatusCode.badRequest,
      body: {
        code: 'notAllowedMessage',
        message: 'message is not allowed',
      },
    };

    expect(hello(request)).toStrictEqual(expected);
  });

  it('should return a validation error', () => {
    const request = {
      name: 'MokoCatMokoCat',
      status: 10,
    };

    const expected = {
      statusCode: HttpStatusCode.unprocessableEntity,
      body: {
        message: `Unprocessable Entity`,
        validationErrors: [
          { key: 'name', reason: 'must NOT have more than 8 characters' },
          { key: 'status', reason: 'must be <= 1' },
        ],
      },
    };

    expect(hello(request)).toStrictEqual(expected);
  });
});
