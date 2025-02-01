import serverless, { Handler } from 'serverless-http';
import express, { Router } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import 'express-async-errors';
import errorMiddleware from './ErrorMiddleware';
import { connect } from './mongooseHelper';

let conn = null;

export const handlerPath = (context: string) => {
  return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`;
};

export const generateHandler = async (router: Router): Promise<Handler> => {
  try {
    conn = conn || (await connect());
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
    app.use(router);
    app.use(errorMiddleware);
    return serverless(app, { basePath: '/v1', binary: ['*/*'] });
  } catch (error) {
    return error;
  }
};
