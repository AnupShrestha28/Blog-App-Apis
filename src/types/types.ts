import { Request } from "express";

export interface UserPayload {
  id: string;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
