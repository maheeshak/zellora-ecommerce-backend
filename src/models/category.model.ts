import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: false,
    },
}, { timestamps: true });


const Category = mongoose.model("Category", categorySchema);

export default Category;