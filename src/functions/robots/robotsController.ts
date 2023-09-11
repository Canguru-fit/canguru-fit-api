import { Request, Response } from 'express';
import * as robotsService from './robotsService';

/**
 *  @swagger
 *  tags:
 *      name: Robots API
 *      description: robots API
 */
/**
 *  @swagger
 *
 *  /robots
 *  post:
 *      tags: [robotsAPI]
 *      summary: Creates a new robot
 *      responses:
 *          200:
 *              description: robot created
 */
export const create = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await robotsService.create(req.body));
};

export const read = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await robotsService.read());
};

export const readOne = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await robotsService.readOne(req.params.id));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await robotsService.update(req.params.id, req.body));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await robotsService.remove(req.params.id));
};
