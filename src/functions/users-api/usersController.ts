import { Request, Response } from 'express';
import * as usersService from './usersService';

type ISource = usersService.ISource;

export const signUp = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.signUp(req.params.source as unknown as ISource, req.body));
};

export const confirmSignUp = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.confirmSignUp(req.params.source as unknown as ISource, req.body));
};

export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.forgotPassword(req.params.source as unknown as ISource, req.body));
};

export const confirmForgotPassword = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.confirmForgotPassword(req.params.source as unknown as ISource, req.body));
};

export const changePassword = async (req: Request, res: Response): Promise<Response> => {
  return res.send(
    await usersService.changePassword(req.params.source as unknown as ISource, req.headers.authorization, req.body)
  );
};

export const resendConfirmation = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.resendConfirmation(req.params.source as unknown as ISource, req.body));
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.login(req.params.source as unknown as ISource, req.body));
};

export const validateToken = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.validateToken(req.headers.authorization));
};

export const refreshToken = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.refreshToken(req.params.source as unknown as ISource, req.body));
};
