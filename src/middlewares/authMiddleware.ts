import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
      res.status(401).json({ message: "Authorization token is missing" });
      return; 
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!); 
    (req as any).user = decoded; 

    next(); 
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
