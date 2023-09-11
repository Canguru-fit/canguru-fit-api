import { Request, Response } from 'express';
import * as naturalPersonsService from './naturalPersonsService';

/**
 *  @swagger
 *  tags:
 *      name: NaturalPersons API
 *      description: NaturalPersons API
 */
/**
 *  @swagger
 *
 *  /diligences/natural-persons
 *  post:
 *      tags: [NaturalPersonsAPI]
 *      summary: Creates a new natural person
 *      responses:
 *          200:
 *              description: natural person created
 */
export const create = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await naturalPersonsService.create(req.body));
};

export const read = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await naturalPersonsService.read());
};

export const readOne = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await naturalPersonsService.readOne(req.params.id));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await naturalPersonsService.update(req.params.id, req.body));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await naturalPersonsService.remove(req.params.id));
};
