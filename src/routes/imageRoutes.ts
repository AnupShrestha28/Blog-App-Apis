import { Router } from "express";
import upload from "../multer/multerConfig";
import { uploadImageHandler } from "../controllers/imageController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

// Image Routes
router.post(
  "/:postId/images",
  authenticateUser,
  upload.single("image"),
  uploadImageHandler
);

export default router;
