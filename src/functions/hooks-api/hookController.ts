import { Request, Response } from 'express';
import * as hookService from './hookService';

/**
 *  @swagger
 *  tags:
 *      name: Webhook API
 *      description: Webhook API
 */
/**
 *  @swagger
 *
 *  /hook/bookings:
 *  post:
 *      tags: [WebhookAPI]
 *      summary: Forward webhook requests to others subscribed apis
 *      responses:
 *          200:
 *              description: JSON WebhookAPI
 */
export const bookingsHook = async (req: Request, res: Response): Promise<Response> => {
    return res.send(await hookService.bookingsHook(req));
};

/**
 *  @swagger
 *
 *  /hook/properties:
 *  post:
 *      tags: [WebhookAPI]
 *      summary: Forward webhook requests to others subscribed apis
 *      responses:
 *          200:
 *              description: JSON WebhookAPI
 */
export const propertiesHook = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await hookService.propertiesHook(req));
};

/**
 * @swagger
 *
 *  /subscribe/:
 *  post:
 *      tags: [WebhookAPI]
 *      summary: Subscribes to webhook
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          url:
 *                              type: string
 *                              example: https://my-api.360suites.com.br/my-hook
 *                          name:
 *                              type: string
 *                              example: BOOKING
 *                          requestType:
 *                              type: string
 *                              example: GET
 *      responses:
 *          200:
 *              description: JSON UserApi
 */
export const subscribe = async (req: Request, res: Response): Promise<Response> => {
    return res.send(await hookService.subscribe(req.body));
};
