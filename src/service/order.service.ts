import { CustomError } from "../common/errors/CustomError";
import { CreateOrderDTO, FilterOrderDTO } from "../dto/order.dto";
import Product from "../models/product.model";
import { DeliveryStatus, OrderStatus, PaymentStatus, Status } from "../common/enums/enums";
import User from "../models/user.mode";
import Order from "../models/order.model";

class OrderService {

    public async create(order: CreateOrderDTO) {

        const user = await User.findById(order.userId);
        if (!user) {
            throw new CustomError("User not found", 404);
        }


        if (!order.products || order.products.length === 0) {
            throw new CustomError("No products found in the order", 400);
        }


        const requestedProductIds = order.products.map(product => product.productId);


        const products = await Product.find({ _id: { $in: requestedProductIds } });

        let total: number = 0;


        for (const product of order.products) {
            const dbProduct = products.find(p => p._id.toString() === product.productId);

            if (!dbProduct) {
                throw new CustomError(`Product with ID ${product.productId} not found`, 404);
            }
            if (dbProduct.qty < product.qty) {
                throw new CustomError(`Not enough stock for product ${dbProduct.name}`, 400);
            }
            if (dbProduct.status !== Status.ACTIVE) {
                throw new CustomError(`Product ${dbProduct.name} is not available for purchase`, 400);
            }

            total += product.qty * dbProduct.price;
        }


        const orderCode = await OrderService.generateOrderCode();

        console.log("Payemnt method", order.paymentDetails.paymentMethod);

        const newOrder = new Order({
            userId: order.userId,
            contact: order.contact,
            shippingAddress: order.shippingAddress,
            products: order.products.map(product => {
                const dbProduct = products.find(p => p._id.toString() === product.productId);
                return {
                    productId: product.productId,
                    qty: product.qty,
                    price: dbProduct ? dbProduct.price : 0,
                    colorId: product.colorId,
                };
            }),
            total,
            paymentDetails: {
                paymentMethod: order.paymentDetails.paymentMethod,
                paymentStatus: PaymentStatus.PENDING,
            },
            code: orderCode,
        });

        await newOrder.save();


        for (const product of order.products) {
            const dbProduct = products.find(p => p._id.toString() === product.productId);
            if (dbProduct) {
                dbProduct.qty -= product.qty;
                await dbProduct.save();
            }
        }


        return OrderService.mapToDTO(newOrder);
    }

    public async webFindAll(filter: FilterOrderDTO) {
        const { page = 0, perPage = 10, status, userId } = filter;

        const query = OrderService.getFilterQuery(filter);
        const sort = { createdAt: -1 };

        const { data, pagination } = await OrderService.getPaginatedResults(Order, query, page, perPage, sort);

        const response = await Promise.all(data.map(order => OrderService.mapToDTO(order)));
        return { data: response, pagination };
    }

    public async changePaymentStatus(orderId: string, status: PaymentStatus, transactionId: string) {
        const order = await Order.findById
            (orderId);

        if (!order) {
            throw new CustomError("Order not found", 404);
        }

        if (order.paymentDetails) {
            order.paymentDetails.paymentStatus = status;
            order.paymentDetails.transactionId = transactionId;
        }

        if (status === PaymentStatus.COMPLETED) {
            order.status = OrderStatus.COMPLETED;
        }

        await order.save();

        return OrderService.mapToDTO(order);

    }

    public async changeDeliveryStatus(orderId: string, status: DeliveryStatus, deliveryDate: Date) {
        const order = await Order.findById
            (orderId);

        if (!order) {
            throw new CustomError("Order not found", 404);
        }

        if (order.deliveryDetails) {
            order.deliveryDetails.deliveryStatus = status;
            order.deliveryDetails.deliveryDate = deliveryDate;
        }

        await order.save();

        return OrderService.mapToDTO(order);

    }





    private static async mapToDTO(order: any) {

        const user = await User.findById(order.userId);
        if (!user) {
            throw new Error("User not found");
        }

        return {
            id: order._id,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar,
            },
            contact: {
                name: order.contact.name,
                phone: order.contact.phone,
                email: order.contact.email,
            },
            shippingAddress: {
                street: order.shippingAddress.street,
                city: order.shippingAddress.city,
                province: order.shippingAddress.province,
                postalCode: order.shippingAddress.postalCode,
                country: order.shippingAddress.country,
            },
            products: order.products.map((product: any) => ({
                productId: product.productId,
                qty: product.qty,
                price: product.price,
                colorId: product.colorId,
            })),
            total: order.total,
            paymentDetails: {
                paymentMethod: order.paymentDetails.paymentMethod,
                paymentStatus: order.paymentDetails.paymentStatus,
                paymentDate: order.paymentDetails.paymentDate,
                transactionId: order.paymentDetails.transactionId,

            },
            deliveryDetails: {
                deliveryStatus: order.deliveryDetails.deliveryStatus,
                deliveryDate: order.deliveryDetails.deliveryDate,
            },
            code: order.code,
            status: order.status,
            createdAt: order.createdAt,
        };
    }

    private static async generateOrderCode() {
        const orderCode = Math.random().toString(36).substr(2, 9).toUpperCase();
        const existingOrder = await Order.findOne({ code: orderCode });

        if (existingOrder) {
            return OrderService.generateOrderCode();
        }

        return orderCode;
    }

    private static getFilterQuery(filter: FilterOrderDTO) {
        const { userId, status } = filter;
        const query: any = {};

        if (userId) query.userId = userId;
        if (status) query.status = status;

        return query;
    }

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


}

export default new OrderService();
