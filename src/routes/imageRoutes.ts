import { Router } from "express";
import upload from "../multer/multerConfig";
import {
  uploadImageHandler,
  deleteImageHandler,
  updateImageHandler,
} from "../controllers/imageController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: API for managing images related to posts
 */

/**
 * @swagger
 * /{postId}/images:
 *   post:
 *     summary: Upload an image for a specific post
 *     tags: [Images]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: ID of the post
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *       400:
 *         description: Validation error or file upload error
 */
router.post(
  "/:postId/images",
  authenticateUser,
  upload.single("image"),
  uploadImageHandler
);

/**
 * @swagger
 * /{postId}/images/{imageId}:
 *   put:
 *     summary: Update an image for a specific post
 *     tags: [Images]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: ID of the post
 *         schema:
 *           type: string
 *       - name: imageId
 *         in: path
 *         required: true
 *         description: ID of the image
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Updated image file
 *     responses:
 *       200:
 *         description: Image updated successfully
 *       404:
 *         description: Post or image not found
 */
router.put(
  "/:postId/images/:imageId",
  authenticateUser,
  upload.single("image"),
  updateImageHandler
);

/**
 * @swagger
 * /{postId}/images/{imageId}:
 *   delete:
 *     summary: Delete an image for a specific post
 *     tags: [Images]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: ID of the post
 *         schema:
 *           type: string
 *       - name: imageId
 *         in: path
 *         required: true
 *         description: ID of the image
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         description: Post or image not found
 */
router.delete("/:postId/images/:imageId", authenticateUser, deleteImageHandler);

export default router;
