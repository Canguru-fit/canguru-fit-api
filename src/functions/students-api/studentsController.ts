import { Request, Response } from 'express';
import * as studentsService from './studentsService';

export const readOne = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await studentsService.readOne(req.params.id));
};

export const read = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await studentsService.read());
};

export const create = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await studentsService.create(req.body));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await studentsService.update(req.params.id, req.body));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await studentsService.remove(req.params.id));
};
