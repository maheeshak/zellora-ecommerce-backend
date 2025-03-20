import dotenv from "dotenv";
import connectDB from "../../../config/db";
import CategoryModel from "../../../models/category.model";
import { Category } from "../../enums/enums";

dotenv.config();

const categories: string[] = Object.values(Category);

export const seedCategories = async () => {
    try {
        for (const category of categories) {
        
            const existingCategory = await CategoryModel.findOne({ name: category });

            if (existingCategory) {
                continue;
            }
          
            const newCategory = new CategoryModel({ name: category });
            await newCategory.save();
        }

        console.log("Category Seeder executed successfully.");
    } catch (err) {
        console.error("Category Seeder Error:", err);
    }
};

