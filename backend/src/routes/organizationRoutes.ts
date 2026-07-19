import { Router } from "express";
import {
  assignManager,
  getOrganizationTree,
  getReportees,
} from "../controllers/organizationController";
import { protect } from "../middleware/authMiddleWare";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { EmployeeRole } from "../models/Employee";

const router = Router();

router.use(protect);

// Super Admin can view the complete organization tree
router.get(
  "/tree",
  authorizeRoles(
    EmployeeRole.SUPER_ADMIN,
    EmployeeRole.HR_MANAGER,
    EmployeeRole.EMPLOYEE
  ),
  getOrganizationTree
);

export default router;