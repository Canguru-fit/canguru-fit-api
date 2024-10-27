import { Request, Response } from 'express';
import * as exerciseService from './exerciseService';

export const readOne = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await exerciseService.readOne(req.params.id));
};

export const read = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await exerciseService.read());
};

export const create = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await exerciseService.create(req.body));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await exerciseService.update(req.params.id, req.body));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await exerciseService.remove(req.params.id));
};
