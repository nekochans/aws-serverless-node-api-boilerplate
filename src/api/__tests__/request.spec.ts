import { createApiRequest } from '../request';

describe('request', () => {
  it('should return a merged request object', () => {
    const headers = {
      'content-type': 'application/json',
      'x-request-id': 'aaaaaaaa-bbbbbbbbb-123-ddddddddddddd',
    };

    type Result = {
      id: number;
      name: string;
      'x-request-id': string;
    };

    const pathParams = { id: 1 };
    const bodyParams = { name: 'neko' };

    const expected: Result = {
      id: pathParams.id,
      name: bodyParams.name,
      'x-request-id': headers['x-request-id'],
    };

    const result = createApiRequest<Result>(headers, pathParams, bodyParams);

    expect(result).toStrictEqual(expected);
  });
});
