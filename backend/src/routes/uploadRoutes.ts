import { Router } from "express";

import upload from "../middleware/uploadMiddleware";
import { protect } from "../middleware/authMiddleWare";

const router = Router();

router.post(
  "/profile-image",
  protect,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Please select an image.",
      });

      return;
    }

    // CloudinaryStorage stores the secure
    // uploaded image URL in req.file.path
    const imageUrl = req.file.path;

    res.status(200).json({
      success: true,
      message:
        "Image uploaded successfully.",
      imageUrl,
    });
  }
);

export default router;