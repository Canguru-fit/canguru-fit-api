import { Request, Response } from 'express';
import { Personal } from '@schemas/personals.model';
import { Student } from '@schemas/students.model';
import * as studentsService from './studentsService';

type ReqStudent = Request & { user: (Personal | Student) & { _id: any } };

export const readOne = async (req: ReqStudent, res: Response): Promise<Response> => {
  return res.send(await studentsService.readOne(req.params.id));
};

export const read = async (req: ReqStudent, res: Response): Promise<Response> => {
  return res.send(await studentsService.read(req?.user));
};

export const create = async (req: ReqStudent, res: Response): Promise<Response> => {
  return res.send(await studentsService.create(req?.user, req.body));
};

export const update = async (req: ReqStudent, res: Response): Promise<Response> => {
  return res.send(await studentsService.update(req.params.id, req.body));
};

export const remove = async (req: ReqStudent, res: Response): Promise<Response> => {
  return res.send(await studentsService.remove(req?.user, req.params.id));
};
