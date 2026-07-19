import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Employee, { EmployeeStatus } from "../models/Employee";
import generateToken from "../utils/generateToken";
import { AuthRequest } from "../middleware/authMiddleWare";
 
// Login
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // Find employee and explicitly include password
    const employee = await Employee.findOne({
      email: email.toLowerCase().trim(),
      isDeleted: false,
    }).select("+password");

    if (!employee) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Prevent inactive employees from logging in
    if (employee.status === EmployeeStatus.INACTIVE) {
      res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
      return;
    }

    // Compare entered password with hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      employee.password
    );

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    // Generate JWT
    const token = generateToken(employee._id.toString());

    // Store JWT in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send successful response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: employee._id,
        employeeId: employee.employeeId,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        designation: employee.designation,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Logout
export const logout = async (
  _req: Request,
  res: Response
): Promise<void> => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

// Get currently logged-in employee
export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const employee = await Employee.findOne({
      _id: req.user.id,
      isDeleted: false,
    });

    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      user: employee,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};