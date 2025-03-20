import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../../common/response/ApiResponse";
import orderService from "../../service/order.service";
import { FilterOrderDTO } from "../../dto/order.dto";
import { OrderStatus } from "../../common/enums/enums";

export const create = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { userId, contact, shippingAddress, products, paymentDetails } = req.body;

        const result = await orderService.create({
            userId,
            contact,
            shippingAddress,
            products,
            paymentDetails
        });

        const response = new ApiResponse(result, "Order created successfully");
        res.status(200).json(response);
    } catch (err) {
        next(err);
    }

};

export const findByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, perPage, status, userId } = req.query; 
        console.log("userId:", userId); 

        const filter: FilterOrderDTO = {
            page: parseInt(page as string) || 0,
            perPage: parseInt(perPage as string) || 10,
            status: status ? (status as OrderStatus) : undefined,
            userId: userId as string, 
        };

        const result = await orderService.webFindAll(filter);
        const response = new ApiResponse(result, "Orders found");
        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
};

export const changePaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params;
        const { status, transactionId } = req.body;

        const result = await orderService.changePaymentStatus(orderId, status, transactionId);
        const response = new ApiResponse(result, "Payment status changed successfully");
        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

export const changeDeliveryStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const { date } = req.body;

        const result = await orderService.changeDeliveryStatus(orderId, status,date);
        const response = new ApiResponse(result, "Delivery status changed successfully");
        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}