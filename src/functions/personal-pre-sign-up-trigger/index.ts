/* eslint-disable import/no-unresolved */
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.run`,
  events: [
    {
      cognitoUserPool: {
        pool: process.env.NODE_ENV !== 'prod' ? `canguru-fit-personal-${process.env.NODE_ENV}` : 'canguru-fit-personal',
        trigger: 'PreSignUp' as const,
        existing: true,
        forceDeploy: true,
      },
    },
  ],
};
