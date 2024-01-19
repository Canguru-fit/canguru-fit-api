/* eslint-disable import/no-unresolved */
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.run`,
  events: [
    {
      cognitoUserPool: {
        pool: process.env.NODE_ENV !== 'prod' ? `quill-${process.env.NODE_ENV}` : 'quill',
        trigger: 'PreSignUp' as const,
        existing: true,
      },
    },
  ],
};
