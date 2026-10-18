import { Request, Response } from "express";
import { Project } from "../models/Project";
import { Profile } from "../models/Profile";
import { Experience } from "../models/Experience";
import "../models/Organization";

const publicOrganization = {
  path: "organization",
  select: "name description url",
  match: { status: "Published", isArchived: false },
};

export async function listProjects(_req: Request, res: Response) {
  const projects = await Project.find({ status: "Published" })
    .select("-description -__v")
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();
  res.json(projects);
}

export async function getProject(req: Request, res: Response) {
  const slug = String(req.params.slug).toLowerCase();
  const project = await Project.findOne({ slug, status: "Published" })
    .select("-__v")
    .lean();

  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }
  res.json(project);
}

export async function getProfile(_req: Request, res: Response) {
  const profile = await Profile.findOne({ role: "Admin" })
    .select("-_id name headline bio email location avatarUrl resumeUrl socials")
    .lean();

  if (!profile) {
    res.status(404).json({ message: "Profile not found" });
    return;
  }
  res.json(profile);
}

export async function listExperience(_req: Request, res: Response) {
  const experience = await Experience.find({
    status: "Published",
    isArchived: false,
  })
    .select("-description -__v")
    .populate(publicOrganization)
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean();
  res.json(experience);
}

export async function getExperience(req: Request, res: Response) {
  const slug = String(req.params.slug).toLowerCase();
  const experience = await Experience.findOne({
    slug,
    status: "Published",
    isArchived: false,
  })
    .select("-__v")
    .populate(publicOrganization)
    .lean();

  if (!experience) {
    res.status(404).json({ message: "Experience not found" });
    return;
  }
  res.json(experience);
}
