import { ErrorRequestHandler, RequestHandler } from "express";

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ message: "Not found" });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};
