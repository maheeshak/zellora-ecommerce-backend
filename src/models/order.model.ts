import mongoose from "mongoose";
import { DeliveryStatus, OrderStatus, PaymentMethod, PaymentStatus } from "../common/enums/enums";

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },

    code: {
        type: String,
        required: true,
    },

    date: {
        type: Date,
        required: true,
        default: Date.now,
    },

    time: {
        type: String,
        required: true,
        default: new Date().toLocaleTimeString(),
    },

    contact: {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
            match: /^[0-9]{10}$/,
            email: {
                type: String,
                required: true,
                match: /^\S+@\S+\.\S+$/,
            },
        },
    },

    shippingAddress: {
        street: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
    },

    products: {
        type: [
            {
                productId: {
                    type: String,
                    required: true,
                    ref: 'Product',
                },
                qty: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0,  // Ensures price can't be negative
                },
                colorId: {
                    type: String,
                    required: true,
                },
            },
        ],
        required: true,
    },

    total: {
        type: Number,
        required: true,
        min: 0,
    },

    paymentDetails: {
        paymentMethod : {
            type: String,
            enum: Object.values(PaymentMethod),
            required: false,
        },
        paymentStatus : {
            type: String,
            enum: Object.values(PaymentStatus),
            required: false,
            default: PaymentStatus.PENDING,
        },
        paymentDate : {
            type: Date,
            required: false,
        },
        transactionId : {
            type: String,
            required: false,
        },

    },

    deliveryDetails: {
        deliveryDate : {
            type: Date,
            required: false,
        },
        deliveryStatus : {
            type: String,
            enum: Object.values(DeliveryStatus),
            default: DeliveryStatus.PENDING,
            required: false,
        },
    },

    status: {
        type: String,
        enum: Object.values(OrderStatus),
        required: true,
        default: OrderStatus.PENDING,
    },
}, { timestamps: true });



const Order = mongoose.model("Order", orderSchema);

export default Order;
