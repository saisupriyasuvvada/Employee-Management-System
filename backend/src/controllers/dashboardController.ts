import { Response } from "express";
import Employee, { EmployeeStatus } from "../models/Employee";
import { AuthRequest } from "../middleware/authMiddleWare";

export const getDashboardStats = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const [
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      departments,
    ] = await Promise.all([
      Employee.countDocuments({
        isDeleted: false,
      }),

      Employee.countDocuments({
        isDeleted: false,
        status: EmployeeStatus.ACTIVE,
      }),

      Employee.countDocuments({
        isDeleted: false,
        status: EmployeeStatus.INACTIVE,
      }),

      Employee.distinct("department", {
        isDeleted: false,
      }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        departmentCount: departments.length,
      },
    });
  } catch (error) {
    console.error("Dashboard statistics error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch dashboard statistics",
    });
  }
};