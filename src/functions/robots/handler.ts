import { APIGatewayProxyEvent, APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { generateHandler } from '@libs/handler-resolver';
import mongoose from 'mongoose';
import routes from './robotsRouter';

export const run: any = async (event: APIGatewayProxyEvent | APIGatewayProxyEventV2, context: Context) => {
  // await mongoose.connect(process.env.MONGODB_URL);
  await mongoose.connect('mongodb+srv://admin:0WAm9GLCHehhU1iz@e-closing.hhj69ux.mongodb.net/eclosing-dev');
  const handler = await generateHandler(routes);
  const result = await handler(event, context);
  await mongoose.disconnect();
  return result;
};
