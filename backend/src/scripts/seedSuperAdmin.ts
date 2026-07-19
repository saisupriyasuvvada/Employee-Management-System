import dns from "node:dns";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "../config/db";
import Employee, {EmployeeRole, EmployeeStatus} from "../models/Employee";

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const seedSuperAdmin = async (): Promise<void> => {
    try {
        await connectDB();

        const existingAdmin = await Employee.findOne({role: EmployeeRole.SUPER_ADMIN});

        if(existingAdmin){
            console.log("Super Admin already exists.");
            return;
        }

        const hashedPassword = await bcrypt.hash("Admin@123",12);

        await Employee.create({
            employeeId: "EMP001",
            name: "Super Admin",
            email: "admin@ems.com",
            password: hashedPassword,
            phone: "9876543210",
            department: "Administration",
            designation: "Super Administrator",
            salary: 100000,
            joiningDate: new Date(),
            status: EmployeeStatus.ACTIVE,
            role: EmployeeRole.SUPER_ADMIN,
            reportingManager: null,
        });

        console.log("Super Admin created successfully...");
    }catch(error){
        console.error("Failed to create Super Admin: ",error);
    }finally{
        await mongoose.connection.close();
    }
};

seedSuperAdmin();