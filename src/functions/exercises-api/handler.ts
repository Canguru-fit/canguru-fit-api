import { APIGatewayProxyEvent, APIGatewayProxyEventV2, Context } from 'aws-lambda';
import { generateHandler } from '@libs/handler-resolver';
import routes from './exerciseRouter';

export const run = async (event: APIGatewayProxyEvent | APIGatewayProxyEventV2, context: Context) => {
  // Make sure to add this so you can re-use `conn` between function calls.
  // See https://www.mongodb.com/blog/post/serverless-development-with-nodejs-aws-lambda-mongodb-atlas
  context.callbackWaitsForEmptyEventLoop = false;

  const handler = await generateHandler(routes);
  return handler(event, context);
};
