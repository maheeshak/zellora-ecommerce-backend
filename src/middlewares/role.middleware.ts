import { NextFunction, Request, Response } from "express";
import { CustomError } from "../common/errors/CustomError";
import tokenService from "../service/token.service";
import Role from "../models/role.model";

export const verifyRole = (requiredRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token: any = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return next(new CustomError('Unauthorized', 401));
        }

        const { roleId } = tokenService.extractToken(token);

        if (!roleId) {
            return next(new CustomError('Forbidden', 403));
        }

        Role.findById(roleId).then((role) => {
            if (!role) {
                return next(new CustomError('Access Denied', 401));
            }
            if (!requiredRoles.includes(role.name)) {
                return next(new CustomError('Access Denied', 401));
            }
        });

        next();
    };
};
