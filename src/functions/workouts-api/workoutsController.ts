import { Request, Response } from 'express';
import * as workoutsService from './workoutsService';

export const readOne = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await workoutsService.readOne(req.params.id));
};

export const read = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await workoutsService.read());
};

export const create = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await workoutsService.create(req.body));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await workoutsService.update(req.params.id, req.body));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await workoutsService.remove(req.params.id));
};
