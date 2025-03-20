import { DeliveryStatus, OrderStatus, PaymentMethod,PaymentStatus } from "../common/enums/enums";
import { BaseFilterDTO } from "./baseFilter.dto";

export interface CreateOrderDTO {
    userId: string;
    contact: {
        name: string;
        phone: string;
        email: string;
    };
    shippingAddress: {
        street: string;
        city: string;
        province: string;
        postalCode: string;
        country: string;
    };
    products: Array<{
        productId: string;
        qty: number;
        colorId: string;
    }>;

    paymentDetails: {
        paymentMethod : PaymentMethod;
    }
}

export interface FilterOrderDTO extends BaseFilterDTO {
    userId? : string;
    status?: OrderStatus;
}