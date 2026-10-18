import mongoose from "mongoose";
import { env } from "./config";

export async function connectDb() {
  await mongoose.connect(env.MONGODB_URI);
  console.log("MongoDB connected");
}
