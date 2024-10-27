import { Request, Response } from 'express';
import * as exerciseRepoService from './exerciseRepoService';

export const readOne = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await exerciseRepoService.readOne(req.params.id));
};

export const read = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await exerciseRepoService.read());
};

export const create = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await exerciseRepoService.create(req.body));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await exerciseRepoService.update(req.params.id, req.body));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await exerciseRepoService.remove(req.params.id));
};
