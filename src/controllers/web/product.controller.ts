import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../common/response/ApiResponse";
import productService from "../../service/product.service";
import { FilterProductDTO } from "../../dto/product.dto";
import { ProductSortBy } from "../../common/enums/enums";

export const findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const result = await productService.findById(id);
        const response = new ApiResponse(result, "Product found");
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

export const findBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;
        const result = await productService.findBySlug(slug);
        const response = new ApiResponse(result, "Product found");
        res.status(200).json(response);
    }
    catch (error) {
        next(error);
    }
};

export const findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
           const { page , perPage, name, price, categoryId, sortBy } = req.query;
           
           const filter: FilterProductDTO = {
               name: name ? name as string : undefined,
               price: price ? parseInt(price as string) : undefined,
               categoryId: categoryId ? categoryId as string : undefined,
               page: parseInt(page as string) || 0,
               perPage: parseInt(perPage as string) || 10,
               sortBy: sortBy ? sortBy as ProductSortBy : undefined
           };
   
           const result = await productService.webFindAll(filter);
           const response = new ApiResponse(result, "Products found");
           res.status(200).json(response);
       } catch (error) {
           next(error);
       }
};

