import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Profile } from "../models/Profile";

export async function getOwnProfile(req: Request, res: Response) {
  // requireAuth guarantees req.auth is set on these routes
  const profile = await Profile.findById(req.auth!.id).select("-__v").lean();
  if (!profile) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  res.json(profile);
}

export async function updateOwnProfile(req: Request, res: Response) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "No valid fields to update" });
    return;
  }

  const profile = await Profile.findByIdAndUpdate(
    req.auth!.id,
    { $set: req.body },
    { new: true, runValidators: true },
  )
    .select("-__v")
    .lean();

  if (!profile) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  res.json(profile);
}

export async function changePassword(req: Request, res: Response) {
  const { currentPassword, newPassword } = req.body;

  const profile = await Profile.findById(req.auth!.id).select("+password");
  const storedHash =
    typeof profile?.password === "string" ? profile.password : "";

  if (
    !profile ||
    !storedHash ||
    !(await bcrypt.compare(currentPassword, storedHash))
  ) {
    res.status(400).json({ message: "Current password is incorrect" });
    return;
  }

  profile.password = newPassword; // hashed by the pre-save hook
  await profile.save();
  res.status(204).end();
}
