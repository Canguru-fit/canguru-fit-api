import { Request, Response } from 'express';
import * as diligencesService from './diligencesService';

/**
 *  @swagger
 *  tags:
 *      name: Diligences API
 *      description: diligences API
 */
/**
 *  @swagger
 *
 *  /diligences
 *  post:
 *      tags: [diligencesAPI]
 *      summary: Creates a new diligence
 *      responses:
 *          200:
 *              description: Token exchanged
 */
export const create = async (_req: Request, res: Response): Promise<Response> => {
    return res.send(await diligencesService.create());
};

export const read = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await diligencesService.read());
};

export const readOne = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await diligencesService.readOne());
};

export const update = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await diligencesService.update());
};

export const remove = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await diligencesService.remove());
};
