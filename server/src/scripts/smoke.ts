import mongoose from "mongoose";
import { connectDb } from "../db";
import { Project } from "../models/Project";

async function run() {
  await connectDb();
  const created = await Project.create({
    title: "Smoke Test",
    slug: "smoke-test",
    summary: "Temporary document",
  });
  console.log("created:", created.toObject());
  console.log("found:", (await Project.findOne({ slug: "smoke-test" }))?.title);
  await Project.deleteOne({ _id: created._id });
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
