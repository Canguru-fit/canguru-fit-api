import { Request, Response } from 'express';
import * as syncService from './exchangeTokenService';

/**
 *  @swagger
 *  tags:
 *      name: Sync API
 *      description: Sync API
 */
/**
 *  @swagger
 *
 *  /exchange-token/:
 *  post:
 *      tags: [ExchangeTokenAPI]
 *      summary: Exhange authorization token from Beds24
 *      responses:
 *          200:
 *              description: Token exchanged
 */
export const exchangeToken = async (_req: Request, res: Response): Promise<Response> => {
    return res.send(await syncService.exchangeToken());
};
