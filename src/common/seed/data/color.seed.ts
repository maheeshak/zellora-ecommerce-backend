import dotenv from "dotenv";
import mongoose from "mongoose";
import ColorModel from "../../../models/color.model";

dotenv.config();

export const colors = {
    BLACK: { name: "Black", hex: "#000000" },
    WHITE: { name: "White", hex: "#FFFFFF" },
    RED: { name: "Red", hex: "#FF0000" },
    BLUE: { name: "Blue", hex: "#0000FF" },
    GREEN: { name: "Green", hex: "#008000" },
    YELLOW: { name: "Yellow", hex: "#FFFF00" },
    PINK: { name: "Pink", hex: "#FFC0CB" },
    PURPLE: { name: "Purple", hex: "#800080" },
    ORANGE: { name: "Orange", hex: "#FFA500" },
    GREY: { name: "Grey", hex: "#808080" },
} 

export const seedColors = async () => {
    try {
        for (const [key, color] of Object.entries(colors)) {
            const existingCategory = await ColorModel.findOne({ name: color.name });

            if (existingCategory) {
                existingCategory.code = color.hex; 
                await existingCategory.save();
                continue;
            }

            const newColor = new ColorModel({
                name: color.name,
                code: color.hex,
            });

            await newColor.save();
        }

        console.log("Color Seeder executed successfully.");
    } catch (err) {
        console.error("Color Seeder Error:", err);
    }
};
