import { Router } from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
  updateEmployee,
} from "../controllers/employeeController";
import { protect } from "../middleware/authMiddleWare";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { EmployeeRole } from "../models/Employee";
import {
  assignManager,
  getReportees,
} from "../controllers/organizationController";

const router = Router();

router.use(protect);

// Super Admin and HR can view the complete employee list
router.get(
  "/",
  authorizeRoles(
    EmployeeRole.SUPER_ADMIN,
    EmployeeRole.HR_MANAGER
  ),
  getEmployees
);

// Super Admin and HR can create employees
router.post(
  "/",
  authorizeRoles(
    EmployeeRole.SUPER_ADMIN,
    EmployeeRole.HR_MANAGER
  ),
  createEmployee
);

router.get(
  "/:id/reportees",
  authorizeRoles(
    EmployeeRole.SUPER_ADMIN,
    EmployeeRole.HR_MANAGER
  ),
  getReportees
);

router.patch(
  "/:id/manager",
  authorizeRoles(EmployeeRole.SUPER_ADMIN),
  assignManager
);

// Authenticated users can access an employee by ID.
// The controller prevents normal employees from viewing others.
router.get("/:id", getEmployeeById);

// Authenticated users can attempt updates.
// The controller applies role and ownership restrictions.
router.put("/:id", updateEmployee);

// Only Super Admin can delete
router.delete(
  "/:id",
  authorizeRoles(EmployeeRole.SUPER_ADMIN),
  deleteEmployee
);

export default router;