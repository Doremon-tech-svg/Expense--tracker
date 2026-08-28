import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function auth(req: any, res: Response, next: NextFunction) {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "No token" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.userId = decoded.id;

    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
