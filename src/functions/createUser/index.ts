import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 25,
  events: [
    {
      httpApi: {
        method: 'post',
        path: '/users',
      },
    },
  ],
};
