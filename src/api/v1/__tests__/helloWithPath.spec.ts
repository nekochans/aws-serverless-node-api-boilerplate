import helloWithPath, {
  HelloWithPathErrorResponse,
  HelloWithPathSuccessResponse,
} from '../helloWithPath';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { validationErrorResponseMessage } from '../../response';
import * as response from '../../response';

describe('helloWithPath', () => {
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
      helloId: 'MokoCat1',
    };

    const expected: HelloWithPathSuccessResponse = {
      statusCode: HttpStatusCode.ok,
      body: {
        message: `HelloWithPath ${request.helloId}, welcome to the exciting Serverless world!`,
      },
      headers: {
        'content-type': 'application/json',
        'x-request-id': fakeRequestId,
      },
    };

    expect(helloWithPath(request)).toStrictEqual(expected);
  });

  it('should return a Error', () => {
    const request = {
      helloId: 'Error',
    };

    const expected: HelloWithPathErrorResponse = {
      statusCode: HttpStatusCode.badRequest,
      body: {
        code: 'notAllowedHelloId',
        message: 'helloId is not allowed',
      },
      headers: {
        'content-type': 'application/json',
        'x-request-id': fakeRequestId,
      },
    };

    expect(helloWithPath(request)).toStrictEqual(expected);
  });

  it('should return a validation error', () => {
    const request = {
      'x-request-id': 'aaaaaaaa-bbbbbbbbb-123-dddddddddddd',
      helloId: 'MokoCatMokoCat',
    };

    const expected = {
      statusCode: HttpStatusCode.unprocessableEntity,
      body: {
        message: validationErrorResponseMessage(),
        validationErrors: [
          { key: 'helloId', reason: 'must NOT have more than 8 characters' },
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

    expect(helloWithPath(request)).toStrictEqual(expected);
  });
});
