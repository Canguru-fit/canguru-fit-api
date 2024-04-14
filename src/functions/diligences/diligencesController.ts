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
 *  /diligences:
 *  post:
 *      tags: [diligencesAPI]
 *      summary: Creates a new diligence
 *      responses:
 *          200:
 *              description: Token exchanged
 */
export const create = async (req: Request, res: Response): Promise<Response> => {
  const { user } = req.headers;
  return res.send(await diligencesService.create(req.body, user));
};

export const read = async (req: Request, res: Response): Promise<Response> => {
  const { user } = req.headers;
  return res.send(await diligencesService.read(user));
};

export const readOne = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await diligencesService.readOne(req.params.id));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await diligencesService.update(req.params.id, req.body));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await diligencesService.remove(req.params.id));
};

export const collect = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await diligencesService.collect(req.body));
};

export const collectExato = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await diligencesService.collectExato(req.body));
};

export const collectPlexi = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await diligencesService.collectPlexi(req.body));
};

export const status = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await diligencesService.status(req.body));
};

export const statusPlexi = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await diligencesService.statusPlexi(req.body));
};

export const document = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await diligencesService.document(req.body));
};

export const upload = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await diligencesService.upload(req.body));
};

export const getStatistics = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await diligencesService.getStatistics());
};
