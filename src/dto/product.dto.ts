import { BooleanSchemaDefinition } from "mongoose";
import { BaseFilterDTO } from "./baseFilter.dto";
import { ProductSortBy, Status } from "../common/enums/enums";

export interface CreateProductDTO {
    name: string;
    price: number;
    qty: number;
    description: string;
    categoryId: string;
    colorIds: [string];
    images: [string];
}

export interface UpdateProductDTO {
    name: string;
    price: number;
    qty: number;
    description: string;
    categoryId: string;
    colorIds: [string];
    images: [string];
}

export interface FilterProductDTO extends BaseFilterDTO {
    name?: string;
    price?: number;
    categoryId?: string;
    status?: Status;
    sortBy?: ProductSortBy;
}