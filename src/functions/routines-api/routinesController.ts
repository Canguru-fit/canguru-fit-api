import { Request, Response } from 'express';
import * as routinesService from './routinesService';

export const readOne = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await routinesService.readOne(req.params.id));
};

export const read = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await routinesService.read());
};

export const create = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await routinesService.create(req.body));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await routinesService.update(req.params.id, req.body));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await routinesService.remove(req.params.id));
};
