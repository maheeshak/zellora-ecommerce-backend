import dotenv from "dotenv";
import RoleModel from "../../../models/role.model";
import { Roles } from "../../enums/enums";

dotenv.config();

const roles: string[] = Object.values(Roles);

export const seedRoles = async () => {
    try {
        for (const role of roles) {
        
            const existingRole = await RoleModel.findOne({ name: role });

            if (existingRole) {
                continue;
            }
          
            const newRole = new RoleModel({ name: role });
            await newRole.save();
        }

        console.log("Role Seeder executed successfully.");
    } catch (err) {
        console.error("Role Seeder Error:", err);
    }
};

