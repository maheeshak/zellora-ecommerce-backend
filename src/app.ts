import express from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import adminAuthRoutes from "./routes/admin/auth.route";
import authRoutes from "./routes/auth.route";
import webAuthRoutes from "./routes/web/auth.route";
import categoryRoutes from "./routes/category.route";
import errorHandler from "./middlewares/error.middleware";
import adminProductRoutes from "./routes/admin/product.route";
import productRoutes from "./routes/product.route";
import colorRoutes from "./routes/color.route";
import webOrderRoutes from "./routes/web/order.route";



dotenv.config();
const app = express();

connectDB();
app.use(express.json());

// Admin Routes
app.use("/api/v1/admin/auth", adminAuthRoutes);
app.use("/api/v1/admin/products", adminProductRoutes);

// Web Routes
app.use("/api/v1/web/auth", webAuthRoutes);
app.use("/api/v1/web/orders", webOrderRoutes);


// Global Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/colors", colorRoutes);

app.use(errorHandler);

export default app;
