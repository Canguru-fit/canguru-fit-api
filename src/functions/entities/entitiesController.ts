import { Request, Response } from 'express';
import * as entitiesService from './entitiesService';

/**
 *  @swagger
 *  tags:
 *      name: Entities API
 *      description: Entities API
 */
/**
 *  @swagger
 *
 *  /diligences/entities/:
 *  post:
 *      tags: [EntitiesAPI]
 *      summary: Creates a new entity
 *      responses:
 *          200:
 *              description: entity created
 */
export const create = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await entitiesService.create(req.body));
};

export const read = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await entitiesService.read());
};

export const readOne = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await entitiesService.readOne(req.params.id));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await entitiesService.update(req.params.id, req.body));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await entitiesService.remove(req.params.id));
};
