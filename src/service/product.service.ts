import e from "express";
import { CustomError } from "../common/errors/CustomError";
import { CreateProductDTO, FilterProductDTO, UpdateProductDTO } from "../dto/product.dto";
import Product from "../models/product.model";
import Category from "../models/category.model";
import { ProductSortBy, Status } from "../common/enums/enums";
import Color from "../models/color.model";
import { configDotenv } from "dotenv";

class ProductService {
    public async create(product: CreateProductDTO) {
        const { name, price, description, categoryId, colorIds, images, qty } = product;

        // check if category exists
        const existingCategory = await Category.findOne({
            _id: categoryId
        });

        // check if colors exist
        const existingColors = await Color.find({
            _id: { $in: colorIds }
        });

        if (!existingColors) {
            throw new CustomError("Sorry! This color does not exist", 400);
        }

        if (!existingCategory) {
            throw new CustomError("Sorry! This category does not exist", 400);
        }

        const slug = await ProductService.generateSlug(name);

        const newProduct = new Product({
            name,
            slug,
            price,
            qty,
            description,
            category: existingCategory._id,
            colors: existingColors.map(color => color._id),
            images
        });

        await newProduct.save();

        const responseProductDTO = ProductService.mapToDTO(newProduct);

        return responseProductDTO;
    }

    public async findById(id: string) {
        const existingProduct = await Product.findOne({ _id: id, status: Status.ACTIVE });

        if (!existingProduct) {
            throw new CustomError("Sorry! This product does not exist or is not active", 400);
        }

        const category: any = await Category.findById(existingProduct.category);

        const responseProductDTO = ProductService.mapToDTO(existingProduct);

        return responseProductDTO;
    }

    public async findBySlug(slug: string) {
        const existingProduct = await Product.findOne({ slug, status: Status.ACTIVE });

        if (!existingProduct) {
            throw new CustomError("Sorry! This product does not exist or is not active", 400);
        }

        const category: any = await Category.findById(existingProduct.category);

        const responseProductDTO = ProductService.mapToDTO(existingProduct);

        return responseProductDTO;
    }


    public async update(id: string, product: UpdateProductDTO) {
        const existingProduct = await Product.findById
            (id);
        if (!existingProduct) {
            throw new CustomError("Sorry! This product does not exist", 400);
        }

        const { name, price, description, categoryId, images, qty, colorIds } = product;

        // check if category exists
        const existingCategory = await Category.findOne({
            _id: categoryId
        });

        // check if colors exist
        const existingColors = await Color.find({
            _id: { $in: colorIds }
        });

        if (!existingColors) {
            throw new CustomError("Sorry! This color does not exist", 400);
        }

        if (!existingCategory) {
            throw new CustomError("Sorry! This category does not exist", 400);
        }

        existingProduct.name = name;
        existingProduct.price = price;
        existingProduct.qty = qty;
        existingProduct.description = description;
        existingProduct.category = existingCategory._id.toString();
        existingProduct.colors = existingColors.map(color => color._id.toString());
        existingProduct.images = images;

        await existingProduct.save();

        const responseProductDTO = ProductService.mapToDTO(existingProduct);

        return responseProductDTO;

    }


    public async changeStatus(id: string, status: Status) {
        const existingProduct = await Product.findById
            (id);
        if (!existingProduct) {
            throw new CustomError("Sorry! This product does not exist", 400);
        }

        existingProduct.status = status;
        await existingProduct.save();

        const responseProductDTO = ProductService.mapToDTO(existingProduct)

        return responseProductDTO;

    }

    public async webFindAll(filter: FilterProductDTO) {
        const { page = 0, perPage = 10, name, price, categoryId } = filter;

        const query = ProductService.getFilterQuery(filter);
        query.status = Status.ACTIVE; // Ensure only active products are fetched

        const sort = { createdAt: -1 }; // Default sorting
        const { data, pagination } = await ProductService.getPaginatedResults(Product, query, page, perPage, sort);

        const responseProductDTO = await Promise.all(data.map(product => ProductService.mapToDTO(product)));

        return { data: responseProductDTO, pagination };
    }

    public async adminFindAll(filter: FilterProductDTO) {
        const { page = 0, perPage = 10, sortBy } = filter;

        const query = ProductService.getFilterQuery(filter);

        const sort = ProductService.getSortOptions(sortBy);

        const { data, pagination } = await ProductService.getPaginatedResults(Product, query, page, perPage, sort);

        const responseProductDTO = await Promise.all(data.map(product => ProductService.mapToDTO(product)));


        return { data: responseProductDTO, pagination };
    }


    // Helper methods

    private static async getPaginatedResults(model: any, filter: any, page: number, perPage: number, sortBy: any) {
        const totalCount = await model.countDocuments(filter);
        const results = await model.find(filter)
            .limit(perPage)
            .skip(page * perPage)
            .sort(sortBy);

        const totalPages = Math.ceil(totalCount / perPage);
        const hasNextPage = page + 1 < totalPages;

        return { data: results, pagination: { totalCount, currentPage: page, totalPages, hasNextPage } };
    }

    private static getSortOptions(sortBy: any) {
        const sortOptions: Record<string, any> = {
            [ProductSortBy.PRICE_ASC]: { price: 1 },
            [ProductSortBy.PRICE_DESC]: { price: -1 },
            [ProductSortBy.NAME_ASC]: { name: 1 },
            [ProductSortBy.NAME_DESC]: { name: -1 },
            [ProductSortBy.CREATED_AT_ASC]: { createdAt: 1 },
            [ProductSortBy.CREATED_AT_DESC]: { createdAt: -1 }
        };

        return sortOptions[sortBy] || { createdAt: -1 };
    }

    private static getFilterQuery(filter: FilterProductDTO) {
        const { name, price, categoryId, status } = filter;
        const query: any = {};

        if (name) query.name = { $regex: name, $options: "i" };
        if (price) query.price = price;
        if (categoryId) query.category = categoryId;
        if (status) query.status = status;

        return query;
    }

    private static async mapToDTO(product: any) {

        // find category
        const category: any = await Category.findById(product.category);

        // find colors
        const colors: any[] = await Color.find({ _id: { $in: product.colors } });


        return {
            id: product._id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            qty: product.qty,
            description: product.description,
            category: {
                id: category._id,
                name: category.name
            },
            colors: colors.map(color => ({
                id: (color as any)._id,
                name: (color as any).name,
                code : (color as any).code
            })),

            images: product.images,
            status: product.status

        };
    }

    private static async generateSlug(name: string) {
        let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        let existingProduct = await Product.findOne({ slug });

        let count = 1;
        while (existingProduct) {
            slug = `${slug}-${count}`;
            existingProduct = await Product.findOne({ slug });
            count++;
        }

        return slug;
    }
}


export default new ProductService();