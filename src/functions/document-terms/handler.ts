import { APIGatewayProxyEvent, APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { generateHandler } from '@libs/handler-resolver';
import mongoose from 'mongoose';
import routes from './documentTermsRouter';

export const run: any = async (event: APIGatewayProxyEvent | APIGatewayProxyEventV2, context: Context) => {
  await mongoose.connect(process.env.MONGODB_URL);
  const handler = await generateHandler(routes);
  const result = await handler(event, context);
  await mongoose.disconnect();
  return result;
};
