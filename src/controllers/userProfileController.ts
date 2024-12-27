import { Request, Response } from "express";
import {
  getUserDetails,
  updateUserDetails,
} from "../services/userProfileService";

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const result = await getUserDetails(userId);

    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await updateUserDetails(req.user?.id, req.body);

    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
