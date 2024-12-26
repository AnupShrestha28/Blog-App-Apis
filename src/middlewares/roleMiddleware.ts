import { Request, Response, NextFunction } from "express";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user;

  if (!user || user.role !== "ADMIN") {
    res.status(403).json({ message: "Forbidden: Admin access required." });
    return;
  }

  next();
};
