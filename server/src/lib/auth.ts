import jwt from "jsonwebtoken";
import { env } from "../config";

export const COOKIE_NAME = "portfolio_token";

const SESSION_SECONDS = env.JWT_EXPIRES_IN_DAYS * 24 * 60 * 60;

export const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export const sessionCookieOptions = {
  ...cookieOptions,
  maxAge: SESSION_SECONDS * 1000,
};

export function signToken(profileId: string) {
  return jwt.sign({}, env.JWT_SECRET, {
    subject: profileId,
    expiresIn: SESSION_SECONDS,
    algorithm: "HS256",
  });
}

export function verifyToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    return typeof payload === "object" && payload.sub ? payload.sub : null;
  } catch {
    return null;
  }
}
