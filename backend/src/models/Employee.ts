import mongoose, { Document, Schema } from "mongoose";

export enum EmployeeRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    HR_MANAGER = "HR_MANAGER",
    EMPLOYEE = "EMPLOYEE",
}

export enum EmployeeStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
}

export interface IEmployee extends Document{
    employeeId: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    department: string;
    designation: string;
    salary: number;
    joiningDate: Date;
    status: EmployeeStatus;
    role: EmployeeRole;
    reportingManager: mongoose.Types.ObjectId | null;
    profileImage?: string;
    isDeleted: boolean;
}

const employeeSchema: Schema<IEmployee> = new Schema(
    {
        employeeId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        phone:{
            type: String,
            required: true,
            trim: true,
        },

        department: {
            type: String,
            required: true,
            trim: true,
        },

        designation: {
            type: String,
            required: true,
            trim: true,
        },

        salary: {
            type: Number,
            required: true,
            min: 0,
        },

        joiningDate: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: Object.values(EmployeeStatus),
            default: EmployeeStatus.ACTIVE,
        },

        role: {
            type: String,
            enum : Object.values(EmployeeRole),
            default: EmployeeRole.EMPLOYEE,
        },

        reportingManager: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            default: null,
        },

        profileImage: {
            type: String,
            default: "",
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Employee = mongoose.model<IEmployee>(
    "Employee",
    employeeSchema
);

export default Employee;