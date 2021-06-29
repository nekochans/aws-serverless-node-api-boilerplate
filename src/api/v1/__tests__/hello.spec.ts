import hello, { HelloErrorResponse, HelloSuccessResponse } from '../hello';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { validationErrorResponseMessage } from '../../response';
import * as response from '../../response';

describe('hello', () => {
  let responseSpy;
  const fakeRequestId = 'aaaaaaaa-bbbbbbbbb-123-ddddddddddddd';

  beforeEach(() => {
    responseSpy = jest
      .spyOn(response, 'createDefaultResponseHeaders')
      .mockReturnValue({
        'content-type': 'application/json',
        'x-request-id': fakeRequestId,
      });
  });

  afterEach(() => {
    responseSpy.mockRestore();
  });

  it('should return a success message', () => {
    const request = {
      name: 'Moko',
      status: 1,
    };

    const expected: HelloSuccessResponse = {
      statusCode: HttpStatusCode.ok,
      body: {
        message: `Hello ${request.name}, welcome to the exciting Serverless world! Your Status is ${request.status}!`,
      },
      headers: {
        'content-type': 'application/json',
        'x-request-id': fakeRequestId,
      },
    };

    expect(hello(request)).toStrictEqual(expected);
  });

  it('should return a Error', () => {
    const request = {
      name: 'Error',
      status: 1,
    };

    const expected: HelloErrorResponse = {
      statusCode: HttpStatusCode.badRequest,
      body: {
        code: 'notAllowedMessage',
        message: 'message is not allowed',
      },
      headers: {
        'content-type': 'application/json',
        'x-request-id': fakeRequestId,
      },
    };

    expect(hello(request)).toStrictEqual(expected);
  });

  it('should return a validation error', () => {
    const request = {
      'x-request-id': 'aaaaaaaa-bbbbbbbbb-123-dddddddddddd',
      name: 'MokoCatMokoCat',
      status: 10,
    };

    const expected = {
      statusCode: HttpStatusCode.unprocessableEntity,
      body: {
        message: validationErrorResponseMessage(),
        validationErrors: [
          { key: 'name', reason: 'must NOT have more than 8 characters' },
          { key: 'status', reason: 'must be <= 1' },
          {
            key: 'x-request-id',
            reason: 'must NOT have fewer than 36 characters',
          },
        ],
      },
      headers: {
        'content-type': 'application/json',
        'x-request-id': fakeRequestId,
      },
    };

    expect(hello(request)).toStrictEqual(expected);
  });
});
