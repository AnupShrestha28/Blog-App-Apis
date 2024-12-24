import express from 'express';
import { registerUser, loginUser } from '../controllers/userController';

const router = express.Router();

// User Routes
router.post('/register', registerUser);

router.post('/login', loginUser);

export default router;
