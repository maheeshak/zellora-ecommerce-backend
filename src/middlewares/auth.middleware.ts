import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { CustomError } from "../common/errors/CustomError";
import tokenService from "../service/token.service";

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
    const path = req.path;
    const token: any = req.headers.authorization?.split(' ')[1];

    if (!token) return next(new CustomError('Unauthorized', 401));

    const { type } = tokenService.extractToken(token);

    jwt.verify(token, process.env.JWT_SECRET as string, (err) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return next(new CustomError('Token expired', 401));
            }
            return next(new CustomError('Forbidden', 403)); 
        }

        if (path === "/generate-token") {
            if (type !== "ref") {
                console.log(type);
                return next(new CustomError('Forbidden', 403));
            }
        } else {
            if (type !== "acc") {
                console.log(type, "acc");
                return next(new CustomError('Forbidden', 403));
            }
        }
        next();
    });
};
