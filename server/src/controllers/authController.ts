import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Profile } from "../models/Profile";
import {
  COOKIE_NAME,
  cookieOptions,
  sessionCookieOptions,
  signToken,
} from "../lib/auth";

const loginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
});

// Compared against when the username doesn't exist, so response time
// doesn't reveal which usernames are real.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 12);

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }
  const { username, password } = parsed.data;

  const profile = await Profile.findOne({
    username: username.toLowerCase().trim(),
  }).select("+password");

  const storedHash =
    typeof profile?.password === "string" ? profile.password : DUMMY_HASH;
  const passwordOk = await bcrypt.compare(password, storedHash);

  if (!profile || !passwordOk) {
    res.status(401).json({ message: "Invalid username or password" });
    return;
  }

  res.cookie(COOKIE_NAME, signToken(profile.id), sessionCookieOptions);
  res.json({
    id: profile.id,
    username: profile.username,
    firstName: profile.firstName,
    lastName: profile.lastName,
    role: profile.role,
  });
}

export function logout(_req: Request, res: Response) {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.status(204).end();
}

export async function me(req: Request, res: Response) {
  // requireAuth guarantees req.auth is set on this route
  const profile = await Profile.findById(req.auth!.id).select("-__v").lean();

  if (!profile) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  res.json(profile);
}
