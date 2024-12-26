import { Request, Response } from "express";
import { register, login, deleteUser } from "../services/userService";

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

export const deleteUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await deleteUser(id);
    res.status(200).json({ message: result.message });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "An unexpected error occurred." });
    }
  }
};
