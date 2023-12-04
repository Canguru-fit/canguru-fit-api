import { Request, Response } from 'express';
import * as companiesService from './companiesService';

/**
 *  @swagger
 *  tags:
 *      name: Companies API
 *      description: Companies API
 */
/**
 *  @swagger
 *
 *  /companies/:
 *  post:
 *      tags: [comapaniesAPI]
 *      summary: Creates a new company
 *      responses:
 *          200:
 *              description: company created
 */
export const create = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await companiesService.create(req.body));
};

export const read = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await companiesService.read());
};

export const readOne = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await companiesService.readOne(req.params.id));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await companiesService.update(req.params.id, req.body));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await companiesService.remove(req.params.id));
};
