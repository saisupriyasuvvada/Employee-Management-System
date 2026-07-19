import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController";
import { protect } from "../middleware/authMiddleWare";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { EmployeeRole } from "../models/Employee";

const router = Router();

router.get(
  "/stats",
  protect,
  authorizeRoles(
    EmployeeRole.SUPER_ADMIN,
    EmployeeRole.HR_MANAGER
  ),
  getDashboardStats
);

export default router;