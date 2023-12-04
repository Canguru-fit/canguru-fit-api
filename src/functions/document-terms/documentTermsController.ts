import { Request, Response } from 'express';
import * as documentTermsService from './documentTermsService';

/**
 *  @swagger
 *  tags:
 *      name: Robots API
 *      description: robots API
 */
/**
 *  @swagger
 *
 *  /document-terms/:
 *  post:
 *      tags: [documentTermsAPI]
 *      summary: Creates a new document term
 *      responses:
 *          200:
 *              description: document term created
 */
export const create = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await documentTermsService.create(req.body));
};

export const read = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await documentTermsService.read());
};

export const readOne = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await documentTermsService.readOne(req.params.id));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await documentTermsService.update(req.params.id, req.body));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await documentTermsService.remove(req.params.id));
};
