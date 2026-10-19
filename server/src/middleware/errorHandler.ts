import { ErrorRequestHandler, RequestHandler } from "express";
import mongoose from "mongoose";

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ message: "Not found" });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors).map((e) => ({
        path: e.path,
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: `Invalid value for ${err.path}` });
    return;
  }

  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern ?? {})[0] ?? "value";
    res.status(409).json({ message: `That ${field} is already in use` });
    return;
  }

  const status =
    typeof err?.status === "number" && err.status >= 400 && err.status < 500
      ? err.status
      : 500;

  if (status < 500) {
    res.status(status).json({ message: "Bad request" });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};
