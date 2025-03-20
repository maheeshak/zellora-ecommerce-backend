import e, { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../common/response/ApiResponse";
import productService from "../../service/product.service";
import { FilterProductDTO } from "../../dto/product.dto";
import { ProductSortBy } from "../../common/enums/enums";

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, price, qty, description, categoryId, images,colorIds } = req.body;

        const result = await productService.create({
            name,
            price,
            qty,
            description,
            categoryId,
            colorIds,
            images
        });

        const response = new ApiResponse(result, "Product created successfully");
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
}

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

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, price, qty, description, categoryId, colorIds, images } = req.body;

        const result = await productService.update(id, {
            name,
            price,
            qty,
            description,
            categoryId,
            colorIds,
            images
        });

        const response = new ApiResponse(result, "Product updated successfully");
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

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

        const result = await productService.adminFindAll(filter);
        const response = new ApiResponse(result, "Products found");
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};


export const changeStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await productService.changeStatus(id, status);
        const response = new ApiResponse(result, "Product status updated successfully");
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};
