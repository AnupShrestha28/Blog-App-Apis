import { Router } from "express";
import upload from "../multer/multerConfig";
import { uploadImageHandler } from "../controllers/imageController";

const router = Router();

// Route to upload an image for a specific post
router.post("/:postId/images", upload.single("image"), uploadImageHandler);

export default router;
