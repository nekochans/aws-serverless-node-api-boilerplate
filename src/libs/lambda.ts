import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const middyfy = (handler) => {
  return middy(handler).use(middyJsonBodyParser());
};
