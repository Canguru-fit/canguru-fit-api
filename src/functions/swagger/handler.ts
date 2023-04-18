import { APIGatewayProxyEvent, APIGatewayProxyEventV2, Context } from 'aws-lambda';
import express, { Router } from 'express';
import serverless from 'serverless-http';
import routes from './swaggerRoutes';

const generateHandler = async (router: Router): Promise<any> => {
    const app = express();
    app.use(router);
    return serverless(app);
};

export const run: any = async (event: APIGatewayProxyEvent | APIGatewayProxyEventV2, context: Context) => {
    const handler = await generateHandler(routes);
    const result = await handler(event, context);
    return result;
};
