import mongoose from "mongoose";
import { connectDb } from "../db";
import { Project } from "../models/Project";
import { Experience } from "../models/Experience";
import { Organization } from "../models/Organization";
import { Profile } from "../models/Profile";

const projects = [
  {
    title: "Sample Project",
    slug: "sample-project",
    summary: "A published project used to test the public API.",
    description: "Longer write-up goes here. Replace this with a real project.",
    skills: ["React", "Node", "MongoDB"],
    displayOrder: 1,
    status: "Published",
  },
  {
    title: "Hidden Draft",
    slug: "hidden-draft",
    summary: "This should never appear in the public API.",
    displayOrder: 2,
    status: "Draft",
  },
  {
    title: "Archived Project",
    slug: "archived-project",
    summary: "This should never appear in the public API.",
    displayOrder: 3,
    status: "Published",
    isArchived: true,
  },
];

async function run() {
  await connectDb();

  for (const p of projects) {
    await Project.updateOne({ slug: p.slug }, { $set: p }, { upsert: true });
  }

  const org = await Organization.findOneAndUpdate(
    { name: "Sample Company" },
    {
      name: "Sample Company",
      description: "Where the sample role happened.",
      url: "https://example.com",
      status: "Published",
    },
    { upsert: true, new: true },
  );

  const experiences = [
    {
      title: "Sample Role",
      slug: "sample-role",
      summary: "A published experience entry.",
      description: "Longer write-up of the role.",
      startedOn: new Date("2026-01-01T12:00:00"),
      organization: org._id,
      displayOrder: 1,
      status: "Published",
    },
    {
      title: "Hidden Role",
      slug: "hidden-role",
      summary: "This should never appear in the public API.",
      startedOn: new Date("2025-01-01T12:00:00"),
      organization: org._id,
      displayOrder: 2,
      status: "Draft",
    },
  ];

  for (const e of experiences) {
    await Experience.updateOne({ slug: e.slug }, { $set: e }, { upsert: true });
  }

  await Profile.findOneAndUpdate(
    {},
    {
      firstName: "First Name",
      lastName: "Last Name",
      headline: "Full-stack developer",
      bio: "Short bio goes here.",
      email: "you@example.com",
      socials: [{ label: "GitHub", url: "https://github.com/your-handle" }],
    },
    { upsert: true },
  );

  console.log("Seed complete");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
