import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import { env } from "./config";
import { publicRouter } from "./routes/publicRoutes";
import { errorHandler, notFound } from "./middleware/errorHandler";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/authRoutes";
import { adminRouter } from "./routes/adminRoutes";

export const app = express();

if (env.NODE_ENV === "production") app.set("trust proxy", 1);

app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: process.uptime(),
  });
});

app.use("/api", publicRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

app.use(notFound);
app.use(errorHandler);
