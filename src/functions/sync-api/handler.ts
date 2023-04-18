import { APIGatewayProxyEvent, APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { generateHandler } from '@libs/handler-resolver';
import routes from './syncRouter';
import mongoose from 'mongoose';

export const run: any = async (event: APIGatewayProxyEvent | APIGatewayProxyEventV2, context: Context) => {
    await mongoose.connect(process.env.MONGO_DB_URL);
    const handler = await generateHandler(routes);
    const result = await handler(event, context);
    await mongoose.disconnect();
    return result;
};
