import { Request, Response } from 'express';
import * as usersService from './usersService';

/**
 *  @swagger
 *  tags:
 *      name: Users API
 *      description: users API
 */
/**
 *  @swagger
 *
 *  /users/:
 *  post:
 *      tags: [userAPI]
 *      summary: Creates a new user
 *      responses:
 *          200:
 *              description: user created
 */
export const create = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.create(req.body));
};

export const resendTempPassword = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.resendTemporaryPassword(req.params.id));
};

export const read = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.read());
};

export const readOne = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.readOne(req.params.id));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.update(req.params.id, req.body));
};

export const toggleStatus = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.toggleStatus(req.params.id, req.body));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.remove(req.params.id));
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.login(req.body));
};

export const verifyToken = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.verifyToken(req));
};

export const forgot = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.forgot(req.body));
};

export const updatePassword = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.updatePassword(req.body));
};
