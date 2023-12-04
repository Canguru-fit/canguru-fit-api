/* eslint-disable import/no-unresolved */
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.run`,
  events: [
    {
      http: {
        method: 'any',
        path: 'users',
      },
    },
    {
      http: {
        method: 'any',
        path: 'users/{proxy+}',
      },
    },
  ],
};