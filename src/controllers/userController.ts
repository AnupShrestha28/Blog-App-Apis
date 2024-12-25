import { Request, Response } from "express";
import {
  register,
  login,
  getUserDetails,
  updateUserDetails,
} from "../services/userService";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = await register(username, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const result = await login(username, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await getUserDetails(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { username, email, oldPassword, newPassword } = req.body;

    const updatedUser = await updateUserDetails(
      userId,
      username,
      email,
      oldPassword,
      newPassword
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
