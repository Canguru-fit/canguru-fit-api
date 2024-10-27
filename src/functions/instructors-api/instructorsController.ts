import { Request, Response } from 'express';
import * as instructorsService from './instructorsService';

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
  return res.send(await instructorsService.create(req.body));
};

export const resendTempPassword = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await instructorsService.resendTemporaryPassword(req.params.id));
};

export const read = async (_req: Request, res: Response): Promise<Response> => {
  return res.send(await instructorsService.read());
};

export const readOne = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await instructorsService.readOne(req.params.id));
};

export const update = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await instructorsService.update(req.params.id, req.body));
};

export const toggleStatus = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await instructorsService.toggleStatus(req.params.id, req.body));
};

export const remove = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await instructorsService.remove(req.params.id));
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await instructorsService.login(req.body));
};

export const verifyToken = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await instructorsService.verifyToken(req));
};

export const forgot = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.forgot(req.body));
};

export const updatePassword = async (req: Request, res: Response): Promise<Response> => {
  return res.send(await usersService.updatePassword(req.body));
};
