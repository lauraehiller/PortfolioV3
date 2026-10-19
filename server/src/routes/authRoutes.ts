import { Router } from "express";
import { login, logout, me } from "../controllers/authController";
import { requireAuth } from "../middleware/auth";
import { loginLimiter } from "../middleware/rateLimiters";

export const authRouter = Router();

authRouter.post("/login", loginLimiter, login);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, me);
