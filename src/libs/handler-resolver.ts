// import awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
// import express, { Router } from 'serverless-express/express';
import serverless, { Handler } from 'serverless-http';
// import serverlessExpress from '@vendia/serverless-express';
import express, { Router } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import errorMiddleware from '../middleware/ErrorMiddleware';
// import { /* infoLogger, */ errorLogger } from '../middleware/LoggerMiddleware';

export const handlerPath = (context: string) => {
    return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`;
};

export const generateHandler = async (router: Router): Promise<Handler> => {
    try {
        const app = express();
        app.use(cors());

        app.use(helmet());
        app.use(
            express.urlencoded({
                limit: '200mb',
                extended: true,
            })
        );
        app.use(express.json({ limit: '200mb' }));
        // app.use(infoLogger); // Todo Ajustar
        app.use(router);
        // app.use(errorLogger);
        app.use(errorMiddleware);
        return serverless(app, { basePath: '/beds24-api', binary: ['*/*'] });
        // return serverlessExpress({ app });
    } catch (error) {
        return error;
    }
};
