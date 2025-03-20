import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../../../config/db";
import { Roles } from "../../enums/enums";
import User from "../../../models/user.mode";
import RoleModel from "../../../models/role.model";
import { CustomError } from "../../errors/CustomError";

dotenv.config();

const superAdmin = {
    username: 'superadmin',
    email: 'superadmin@example.com',
    password: 'secret',
    role: Roles.ADMIN,
};

export const seedAdmin = async () => {
    try {

        // Check if the super admin already exists
        const existingAdmin = await User.findOne({ email: superAdmin.email });
        if (existingAdmin) {
            console.log('User Seeder executed successfully.');
            return;
        }

        const role = await RoleModel.findOne({ name: Roles.ADMIN });
        if (!role) {
            throw new CustomError("Sorry! Role not found.", 400);
        }

        // Create super admin
        const hashedPassword = await bcrypt.hash(superAdmin.password, 10);
        const newAdmin = new User({
            username: superAdmin.username,
            email: superAdmin.email,
            password: hashedPassword,
            roleId: role._id.toString(),
        });

        await newAdmin.save();
        console.log('User Seeder executed successfully.');
    } catch (err) {
        console.error("User Seeder Error: ", err);
    }
};
