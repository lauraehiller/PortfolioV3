import { RequestHandler } from "express";
import { COOKIE_NAME, verifyToken } from "../lib/auth";
import { Profile } from "../models/Profile";

type Role = "Admin" | "Editor";

export const requireAuth: RequestHandler = async (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAME];
  const id = typeof token === "string" ? verifyToken(token) : null;

  if (!id) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const profile = await Profile.findById(id).select("role").lean();
  if (!profile) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  req.auth = { id, role: profile.role as Role };
  next();
};

export const requireRole =
  (...roles: Role[]): RequestHandler =>
  (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
