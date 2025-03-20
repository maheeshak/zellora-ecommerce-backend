import { NextFunction, Request, Response } from "express";
import { CustomError } from "../common/errors/CustomError";


const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    error: message
  });
}

export default errorHandler;
