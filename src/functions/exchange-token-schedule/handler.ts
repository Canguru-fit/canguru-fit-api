import { APIGatewayProxyEvent, APIGatewayProxyEventV2, Context } from 'aws-lambda';
import mongoose from 'mongoose';
import * as syncService from '../exchange-token-api/exchangeTokenService';


export const run: any = async (_event: APIGatewayProxyEvent | APIGatewayProxyEventV2, _context: Context) => {
    await mongoose.connect(process.env.MONGO_DB_URL);
    const token = await syncService.exchangeToken();
    await mongoose.disconnect();
    console.log('New token created', token)
};
