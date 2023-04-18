import { NextFunction, Request, Response } from 'express';
import Exception from '../types/Exceptions'; // Todo ajustar tipagem

function errorMiddleware(error: Exception | Exception, _: Request, response: Response, __: NextFunction): Response {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    const code = error.code || '001';
    const field_errors = error.field_errors || undefined;
    const stack = error ? error.stack : '';
    return response.status(status).send({
        message,
        code,
        stack,
        field_errors,
    });
}

export default errorMiddleware;
