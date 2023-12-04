/* eslint-disable import/no-unresolved */
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.run`,
  events: [
    {
      http: {
        method: 'any',
        path: 'document-terms',
      },
    },
    {
      http: {
        method: 'any',
        path: 'document-terms/{proxy+}',
      },
    },
  ],
};
