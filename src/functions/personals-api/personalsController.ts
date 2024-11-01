import { Request, Response } from 'express';
import * as personalsService from './personalsService';

export const create = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await personalsService.create(req.body));
};

export const read = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await personalsService.read());
};

export const readOne = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await personalsService.readOne(req.params.id));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await personalsService.update(req.params.id, req.body));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await personalsService.remove(req.params.id));
};
