import { Response } from "express";
import bcrypt from "bcryptjs";
import Employee, {
  EmployeeRole,
  EmployeeStatus,
} from "../models/Employee";
import { AuthRequest } from "../middleware/authMiddleWare";
import {
  isValidDate,
  isValidEmail,
  isValidPhone,
  isValidSalary,
} from "../utils/validators";

// CREATE EMPLOYEE
export const createEmployee = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      employeeId,
      name,
      email,
      password,
      phone,
      department,
      designation,
      salary,
      joiningDate,
      status,
      role,
      reportingManager,
      profileImage,
    } = req.body;

    if (
      !employeeId ||
      !name ||
      !email ||
      !password ||
      !phone ||
      !department ||
      !designation ||
      salary === undefined ||
      !joiningDate
    ) {
      res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
      return;
    }

    if(!isValidEmail(email)){
      res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
      return;
    }

    if(!isValidPhone(phone)){
      res.status(400).json({
        success: false,
        message: "Phone number must contain 10 to 15 digits",
      });
      return;
    }

    if(!isValidSalary(salary)){
      res.status(400).json({
        success: false,
        message: "Salary must be a valid non-negative number",
      });
      return;
    }

    if(!isValidDate(joiningDate)){
      res.status(400).json({
        success: false,
        message: "Please provide a valid joining date",
      });
      return;
    }

    if(role && !Object.values(EmployeeRole).includes(role)){
      res.status(400).json({
        success: false,
        message: "Invalid employee role",
      });
      return;
    }

    if(status && !Object.values(EmployeeStatus).includes(status)){
      res.status(400).json({
        success: false,
        message: "Invalid employee status",
      });
      return;
    }

    // HR cannot create a Super Admin
    if (
      req.user?.role === EmployeeRole.HR_MANAGER &&
      role === EmployeeRole.SUPER_ADMIN
    ) {
      res.status(403).json({
        success: false,
        message: "HR Manager cannot create a Super Admin",
      });
      return;
    }

    const existingEmployee = await Employee.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { employeeId },
      ],
    });

    if (existingEmployee) {
      res.status(409).json({
        success: false,
        message: "Employee ID or email already exists",
      });
      return;
    }

    if (reportingManager) {
      const manager = await Employee.findOne({
        _id: reportingManager,
        isDeleted: false,
      });

      if (!manager) {
        res.status(400).json({
          success: false,
          message: "Invalid reporting manager",
        });
        return;
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const employee = await Employee.create({
      employeeId,
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone,
      department,
      designation,
      salary,
      joiningDate,
      status: status || EmployeeStatus.ACTIVE,
      role: role || EmployeeRole.EMPLOYEE,
      reportingManager: reportingManager || null,
      profileImage: profileImage || "",
    });

    const employeeResponse = await Employee.findById(employee._id).populate(
      "reportingManager",
      "employeeId name email designation"
    );

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee: employeeResponse,
    });
  } catch (error) {
    console.error("Create employee error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET ALL EMPLOYEES
export const getEmployees = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      search,
      department,
      role,
      status,
      sortBy = "createdAt",
      order = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    const filter: Record<string, unknown> = {
      isDeleted: false,
    };

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search as string,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search as string,
            $options: "i",
          },
        },
      ];
    }

    if (department) {
      filter.department = department;
    }

    if (role) {
      filter.role = role;
    }

    if (status) {
      filter.status = status;
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(
      Math.max(Number(limit), 1),
      100
    );

    const allowedSortFields = [
      "name",
      "joiningDate",
      "createdAt",
    ];

    const sortField = allowedSortFields.includes(
      sortBy as string
    )
      ? (sortBy as string)
      : "createdAt";

    const sortOrder = order === "asc" ? 1 : -1;

    const [employees, totalEmployees] = await Promise.all([
      Employee.find(filter)
        .populate(
          "reportingManager",
          "employeeId name email designation"
        )
        .sort({ [sortField]: sortOrder })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),

      Employee.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: employees.length,
      totalEmployees,
      currentPage: pageNumber,
      totalPages: Math.ceil(
        totalEmployees / limitNumber
      ),
      employees,
    });
  } catch (error) {
    console.error("Get employees error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET SINGLE EMPLOYEE
export const getEmployeeById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Normal employees may only view their own profile
    if (
      req.user?.role === EmployeeRole.EMPLOYEE &&
      req.user.id !== req.params.id
    ) {
      res.status(403).json({
        success: false,
        message: "You can only view your own profile",
      });
      return;
    }

    const employee = await Employee.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate(
      "reportingManager",
      "employeeId name email designation"
    );

    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid employee ID",
    });
  }
};

// UPDATE EMPLOYEE
export const updateEmployee = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee not found",
      });
      return;
    }

    const isOwnProfile =
      req.user?.id === employee._id.toString();

    // Employees may update only their own profile
    if (
      req.user?.role === EmployeeRole.EMPLOYEE &&
      !isOwnProfile
    ) {
      res.status(403).json({
        success: false,
        message: "You can only edit your own profile",
      });
      return;
    }

    // Fields an Employee can edit on their own profile
    if (req.user?.role === EmployeeRole.EMPLOYEE) {
      const allowedFields = [
        "name",
        "phone",
        "profileImage",
      ];

      const requestedFields = Object.keys(req.body);

      const hasRestrictedField = requestedFields.some(
        (field) => !allowedFields.includes(field)
      );

      if (hasRestrictedField) {
        res.status(403).json({
          success: false,
          message:
            "Employees can only update name, phone and profile image",
        });
        return;
      }
    }

    // HR cannot assign Super Admin role
    if (
      req.user?.role === EmployeeRole.HR_MANAGER &&
      req.body.role === EmployeeRole.SUPER_ADMIN
    ) {
      res.status(403).json({
        success: false,
        message:
          "HR Manager cannot assign the Super Admin role",
      });
      return;
    }

    // HR cannot modify an existing Super Admin
    if (
      req.user?.role === EmployeeRole.HR_MANAGER &&
      employee.role === EmployeeRole.SUPER_ADMIN
    ) {
      res.status(403).json({
        success: false,
        message: "HR Manager cannot modify a Super Admin",
      });
      return;
    }

    // Validate email
if (req.body.email) {
  if (!isValidEmail(req.body.email)) {
    res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
    return;
  }

  const duplicateEmail = await Employee.findOne({
    email: req.body.email.toLowerCase().trim(),
    _id: { $ne: employee._id },
    isDeleted: false,
  });

  if (duplicateEmail) {
    res.status(409).json({
      success: false,
      message: "Email already exists",
    });
    return;
  }

  req.body.email = req.body.email
    .toLowerCase()
    .trim();
}

// Validate phone
if (
  req.body.phone &&
  !isValidPhone(req.body.phone)
) {
  res.status(400).json({
    success: false,
    message:
      "Phone number must contain 10 to 15 digits",
  });
  return;
}

// Validate salary
if (
  req.body.salary !== undefined &&
  !isValidSalary(req.body.salary)
) {
  res.status(400).json({
    success: false,
    message:
      "Salary must be a valid non-negative number",
  });
  return;
}

// Validate joining date
if (
  req.body.joiningDate &&
  !isValidDate(req.body.joiningDate)
) {
  res.status(400).json({
    success: false,
    message:
      "Please provide a valid joining date",
  });
  return;
}

// Validate role
if (
  req.body.role &&
  !Object.values(EmployeeRole).includes(
    req.body.role
  )
) {
  res.status(400).json({
    success: false,
    message: "Invalid employee role",
  });
  return;
}

// Validate status
if (
  req.body.status &&
  !Object.values(EmployeeStatus).includes(
    req.body.status
  )
) {
  res.status(400).json({
    success: false,
    message: "Invalid employee status",
  });
  return;
}

    if (req.body.employeeId) {
      const duplicateEmployeeId =
        await Employee.findOne({
          employeeId: req.body.employeeId,
          _id: { $ne: employee._id },
        });

      if (duplicateEmployeeId) {
        res.status(409).json({
          success: false,
          message: "Employee ID already exists",
        });
        return;
      }
    }

    // Password should always be hashed
    if (req.body.password) {
      req.body.password = await bcrypt.hash(
        req.body.password,
        12
      );
    }

    const updatedEmployee =
      await Employee.findByIdAndUpdate(
        employee._id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      ).populate(
        "reportingManager",
        "employeeId name email designation"
      );

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Update employee error:", error);

    res.status(400).json({
      success: false,
      message: "Unable to update employee",
    });
  }
};

// SOFT DELETE EMPLOYEE
export const deleteEmployee = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const employee = await Employee.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee not found",
      });
      return;
    }

    // Prevent deleting your own Super Admin account
    if (req.user?.id === employee._id.toString()) {
      res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
      return;
    }

    employee.isDeleted = true;
    employee.status = EmployeeStatus.INACTIVE;

    await employee.save();

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid employee ID",
    });
  }
};