import { NextFunction, Request, Response } from "express";
import categoryService from "../service/category.service";
import { ApiResponse } from "../common/response/ApiResponse";

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await categoryService.findAll();
        const response = new ApiResponse(result, "Categories retrieved successfully");
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};
