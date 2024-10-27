import { NextFunction, Request, Response } from 'express';
import Exception from './Exceptions';

export default function errorMiddleware(
  error: Exception | Exception,
  _: Request,
  response: Response,
  __: NextFunction
): Response {
  console.log(error);
  return response.status(error.status || 500).send({
    message: error.message || 'Something went wrong',
    code: error.code || '001',
    stack: error ? error.stack : '',
    field_errors: error.field_errors || undefined,
  });
}
