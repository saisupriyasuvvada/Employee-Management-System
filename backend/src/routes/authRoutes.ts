import { Router } from "express";
import {
  login,
  logout,
  getMe,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleWare";

const router = Router();

// Public route
router.post("/login", login);

// Logout route
router.post("/logout", logout);

// Protected route - only logged-in users can access
router.get("/me", protect, getMe);

export default router;