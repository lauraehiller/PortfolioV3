import mongoose from "mongoose";
import { z } from "zod";
import { env } from "../config";
import { connectDb } from "../db";
import { Profile } from "../models/Profile";

const adminSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(12).max(72),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

async function run() {
  const parsed = adminSchema.safeParse({
    username: env.ADMIN_USERNAME,
    password: env.ADMIN_PASSWORD,
    firstName: env.ADMIN_FIRSTNAME,
    lastName: env.ADMIN_LASTNAME,
  });

  if (!parsed.success) {
    console.error(
      "Set ADMIN_USERNAME (3+ chars), ADMIN_PASSWORD (12-72 chars) and ADMIN_NAME in .env first.",
    );
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
  }

  await connectDb();

  if (await Profile.exists({ role: "Admin" })) {
    console.log("An Admin already exists. Nothing to do.");
    await mongoose.disconnect();
    return;
  }

  await Profile.create({ ...parsed.data, role: "Admin" });
  console.log(`Admin "${parsed.data.username}" created.`);
  console.log("Remove ADMIN_PASSWORD from .env now.");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
