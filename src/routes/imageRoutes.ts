import { Router } from "express";
import upload from "../multer/multerConfig";
import {
  uploadImageHandler,
  deleteImageHandler,
  updateImageHandler,
} from "../controllers/imageController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

// Image Routes
router.post(
  "/:postId/images",
  authenticateUser,
  upload.single("image"),
  uploadImageHandler
);

router.put(
  "/:postId/images/:imageId",
  authenticateUser,
  upload.single("image"),
  updateImageHandler
);

router.delete("/:postId/images/:imageId", authenticateUser, deleteImageHandler);

export default router;
