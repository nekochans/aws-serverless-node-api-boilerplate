import helloWithPath, {
  HelloWithPathErrorResponse,
  HelloWithPathSuccessResponse,
} from '../helloWithPath';
import { HttpStatusCode } from '@constants/httpStatusCode';
import { validationErrorResponseMessage } from '../../response';

describe('helloWithPath', () => {
  it('should return a success message', () => {
    const request = {
      helloId: 'MokoCat1',
    };

    const expected: HelloWithPathSuccessResponse = {
      statusCode: HttpStatusCode.ok,
      body: {
        message: `HelloWithPath ${request.helloId}, welcome to the exciting Serverless world!`,
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
    };

    expect(helloWithPath(request)).toStrictEqual(expected);
  });

  it('should return a validation error', () => {
    const request = {
      helloId: 'MokoCatMokoCat',
    };

    const expected = {
      statusCode: HttpStatusCode.unprocessableEntity,
      body: {
        message: validationErrorResponseMessage(),
        validationErrors: [
          { key: 'helloId', reason: 'must NOT have more than 8 characters' },
        ],
      },
    };

    expect(helloWithPath(request)).toStrictEqual(expected);
  });
});