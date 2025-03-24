import { Request, Response, NextFunction } from "express";
import HttpException from '@/utils/exceptions/http.exception';

const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const status = error.status || 500;
  const message = error.message || 'An unexpected error occured.';

  res.status(status).send({
    status,
    message
  });
};

export default errorMiddleware;