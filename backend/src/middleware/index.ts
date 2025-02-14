import { Request, Response, NextFunction } from "express";
import { apiResponse } from "../lib/apiResponse";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      cookies: any;
    }
    interface User {
      id: string;
      name: string;
      email: string;
    }
  }
}

interface JwtPayload {
  id: string;
  name: string;
  email: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = req.cookies.token;
    if (!token) {
      apiResponse(res, 401, "Please provide a token");
      return;
    }

    const isValidToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    if (!isValidToken) {
      apiResponse(res, 401, "please provide a valid token");
      return;
    }
    
    req.user = isValidToken;
    next();
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
    apiResponse(res, 500, "internal server error in middleware");
  }
}