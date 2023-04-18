/* eslint-disable import/no-unresolved */
import { handlerPath } from '@libs/handler-resolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.run`,
    events: [
        {
           schedule: 'cron(0 23 * * ? *)'
        },
    ],
};
