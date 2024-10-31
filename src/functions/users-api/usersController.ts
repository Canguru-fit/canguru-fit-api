import { Request, Response } from 'express';
import * as usersService from './usersService';

export const signUp = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.signUp(req.params.source as unknown as 'personal' | 'student', req.body));
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.login(req.params.source as unknown as 'personal' | 'student', req.body));
};

export const validateToken = async (req: Request, res: Response): Promise<Response> => {
  return res.send(
    await usersService.validateToken(req.params.source as unknown as 'personal' | 'student', req.headers.authorization)
  );
};

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.refreshToken(req.params.source as unknown as 'personal' | 'student', req.body));
};