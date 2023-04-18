import { Request, Response } from 'express';
import * as syncService from './syncService';

/**
 *  @swagger
 *  tags:
 *      name: Sync API
 *      description: Sync API
 */
/**
 *  @swagger
 *
 *  /sync/booking:
 *  post:
 *      tags: [SyncAPI]
 *      summary: Syncs incoming booking
 *      responses:
 *          200:
 *              description: Running sync
 */
export const syncBooking = async (req: Request, res: Response): Promise<Response> => {
    return res.send(await syncService.syncBooking(req));
};


/**
 *  @swagger
 *
 *  /sync/property:
 *  post:
 *      tags: [SyncAPI]
 *      summary: Syncs incoming property
 *      responses:
 *          200:
 *              description: Running sync
 */
export const syncProperty = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await syncService.syncProperty(req));
};

/**
 *  @swagger
 *
 *  /sync/properties:
 *  post:
 *      tags: [SyncAPI]
 *      summary: Syncs all properties
 *      responses:
 *          200:
 *              description:Running sync
 */
export const syncProperties = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await syncService.syncProperties(req));
};
