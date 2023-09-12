import { Request, Response } from 'express';
import * as documentTypesService from './documentTypesService';

/**
 *  @swagger
 *  tags:
 *      name: DocumentTypes API
 *      description: DocumentTypes API
 */
/**
 *  @swagger
 *
 *  /document-types/:
 *  post:
 *      tags: [DocumentTypesAPI]
 *      summary: Creates a new documentType
 *      responses:
 *          200:
 *              description: document type created
 */
export const create = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await documentTypesService.create(req.body));
};

export const read = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await documentTypesService.read());
};

export const readOne = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await documentTypesService.readOne(req.params.id));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await documentTypesService.update(req.params.id, req.body));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await diligencesService.remove(req.params.id));
};
