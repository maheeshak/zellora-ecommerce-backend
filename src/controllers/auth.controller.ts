import { NextFunction, Request, Response } from "express";
import authService from "../service/auth.service";
import { ApiResponse } from "../common/response/ApiResponse";

  export const generateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.headers.authorization?.split(" ")[1];
      const result = await authService.generateAccessToken(refreshToken?refreshToken:"");
      const response = new ApiResponse(result, "Access token generated successfully");
      res.status(200).json(response);

    } catch (error) {
      next(error);
    }
  };