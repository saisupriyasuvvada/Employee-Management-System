import { Response } from "express";
import mongoose from "mongoose";
import Employee from "../models/Employee";
import { AuthRequest } from "../middleware/authMiddleWare";

// ASSIGN OR CHANGE REPORTING MANAGER
export const assignManager = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const employeeId = String(req.params.id);
    const managerId = req.body.managerId ? String(req.body.managerId) : null;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
      return;
    }

    const employee = await Employee.findOne({
      _id: employeeId,
      isDeleted: false,
    });

    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee not found",
      });
      return;
    }

    // Allow removing the current reporting manager
    if (!managerId) {
      employee.reportingManager = null;
      await employee.save();

      res.status(200).json({
        success: true,
        message: "Reporting manager removed successfully",
        employee,
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(managerId)) {
      res.status(400).json({
        success: false,
        message: "Invalid manager ID",
      });
      return;
    }

    // Employee cannot report to themselves
    if (employeeId === managerId) {
      res.status(400).json({
        success: false,
        message: "An employee cannot report to themselves",
      });
      return;
    }

    const manager = await Employee.findOne({
      _id: managerId,
      isDeleted: false,
    });

    if (!manager) {
      res.status(404).json({
        success: false,
        message: "Reporting manager not found",
      });
      return;
    }

    // Prevent circular reporting.
    // Follow the proposed manager's manager chain.
    let currentManager = manager;

    while (currentManager.reportingManager) {
      const nextManagerId =
        currentManager.reportingManager.toString();

      if (nextManagerId === employeeId) {
        res.status(400).json({
          success: false,
          message:
            "Cannot assign manager because it would create a circular reporting relationship",
        });
        return;
      }

      const nextManager = await Employee.findOne({
        _id: currentManager.reportingManager,
        isDeleted: false,
      });

      if (!nextManager) {
        break;
      }

      currentManager = nextManager;
    }

    employee.reportingManager =
      new mongoose.Types.ObjectId(managerId);

    await employee.save();

    const updatedEmployee = await Employee.findById(
      employee._id
    ).populate(
      "reportingManager",
      "employeeId name email department designation role"
    );

    res.status(200).json({
      success: true,
      message: "Reporting manager assigned successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Assign manager error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET DIRECT REPORTEES
export const getReportees = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const employeeId = String(req.params.id);

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      res.status(400).json({
        success: false,
        message: "Invalid employee ID",
      });
      return;
    }

    const employee = await Employee.findOne({
      _id: employeeId,
      isDeleted: false,
    });

    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee not found",
      });
      return;
    }

    const reportees = await Employee.find({
      reportingManager: employeeId,
      isDeleted: false,
    })
      .select(
        "employeeId name email department designation status role profileImage"
      )
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      manager: {
        id: employee._id,
        employeeId: employee.employeeId,
        name: employee.name,
      },
      count: reportees.length,
      reportees,
    });
  } catch (error) {
    console.error("Get reportees error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET COMPLETE ORGANIZATION TREE
export const getOrganizationTree = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const employees = await Employee.find({
      isDeleted: false,
    })
      .select(
        "employeeId name email department designation status role reportingManager profileImage"
      )
      .lean();

    const buildTree = (managerId: string | null): any[] => {
      return employees
        .filter((employee) => {
          const reportingManager =
            employee.reportingManager?.toString() || null;

          return reportingManager === managerId;
        })
        .map((employee) => ({
          ...employee,
          reportees: buildTree(employee._id.toString()),
        }));
    };

    // Employees without a reporting manager are the roots
    const tree = buildTree(null);

    res.status(200).json({
      success: true,
      count: employees.length,
      tree,
    });
  } catch (error) {
    console.error("Organization tree error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};