import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Employee, { EmployeeStatus } from "../models/Employee";

interface JwtPayload {
  userId: string;
}

// Extend Express Request to include authenticated user information
export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Middleware to protect private routes
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // First check for token in HTTP-only cookie
    let token = req.cookies?.token;

    // If cookie is unavailable, check Authorization header
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token found
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    // Get JWT secret
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    // Verify JWT
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // Find the authenticated employee
    const employee = await Employee.findOne({
      _id: decoded.userId,
      isDeleted: false,
    });

    if (!employee) {
      res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
      return;
    }

    // Block inactive employees
    if (employee.status === EmployeeStatus.INACTIVE) {
      res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
      return;
    }

    // Attach authenticated user information to request
    req.user = {
      id: employee._id.toString(),
      role: employee.role,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};