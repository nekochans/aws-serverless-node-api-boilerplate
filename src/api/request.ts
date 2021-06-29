export type DefaultApiRequest = {
  'x-request-id'?: string;
};

export type RequestParams = {
  [header: string]: boolean | number | string | unknown;
};

export const createApiRequest = <T>(
  requestHeaders: RequestParams,
  ...requestParams: RequestParams[]
): T => {
  // letを使わない、もっと良い書き方があれば修正する
  let mergedParams = {};
  for (const params of requestParams) {
    mergedParams = { ...mergedParams, ...params };
  }

  const mergedRequest = Object.prototype.hasOwnProperty.call(
    requestHeaders,
    'x-request-id',
  )
    ? {
        ...mergedParams,
        ...{ 'x-request-id': requestHeaders['x-request-id'] },
      }
    : { ...mergedParams };

  return mergedRequest as T;
};
