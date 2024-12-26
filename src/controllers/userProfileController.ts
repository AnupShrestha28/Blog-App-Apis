import { Request, Response } from "express";
import {
  getUserDetails,
  updateUserDetails,
} from "../services/userProfileService";

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentication required." });
      return;
    }

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
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Authentication required." });
      return;
    }

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
