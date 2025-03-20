import { NextFunction, Request, Response } from "express";
import authService from "../../service/auth.service";
import { ApiResponse } from "../../common/response/ApiResponse";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName,lastName, email, password, avatar,phone,address } = req.body;
  
      const result = await authService.adminSignup({ firstName,lastName, email, password, avatar , phone, address});
      const response = new ApiResponse(result, "User created successfully");
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
  
      const result = await authService.adminSignin(email, password);
      const response = new ApiResponse(result, "User signed in successfully");
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
  