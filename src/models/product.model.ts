import mongoose from "mongoose";
import { Status } from "../common/enums/enums";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    qty: {
        type: Number,
        required: true,
        default: 0,
    },

    description: {
        type: String,
        required: false,
    },

    category: {
        type: String,
        required: true,
    },
    colors: {
        type: [String],
        required: true,
    }, 
    status: {
        type: String,
        enum: Object.values(Status),
        required: true,
        default: Status.ACTIVE,
    },
    images: {
        type: [String],
        required: false,
    },
    
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;