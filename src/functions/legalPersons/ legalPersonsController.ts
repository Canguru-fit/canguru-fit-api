import { Request, Response } from 'express';
import * as legalPersonsService from './legalPersonsService';

/**
 *  @swagger
 *  tags:
 *      name: LegalPersons API
 *      description: LegalPersons API
 */
/**
 *  @swagger
 *
 *  /diligences/legal-persons
 *  post:
 *      tags: [LegalPersonsAPI]
 *      summary: Creates a new legal person
 *      responses:
 *          200:
 *              description: legal person created
 */
export const create = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await legalPersonsService.create(req.body));
};

export const read = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await legalPersonsService.read());
};

export const readOne = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await legalPersonsService.readOne(req.params.id));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await legalPersonsService.update(req.params.id, req.body));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await legalPersonsService.remove(req.params.id));
};
