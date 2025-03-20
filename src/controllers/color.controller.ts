import { NextFunction, Request, Response } from "express";
import colorService from "../service/color.service";
import { ApiResponse } from "../common/response/ApiResponse";

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await colorService.findAll();
        const response = new ApiResponse(result, "Colors retrieved successfully");
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};
