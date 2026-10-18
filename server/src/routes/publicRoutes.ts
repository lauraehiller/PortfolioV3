import { Router } from "express";
import {
  getExperience,
  getProfile,
  getProject,
  listExperience,
  listProjects,
} from "../controllers/publicController";

export const publicRouter = Router();

publicRouter.get("/projects", listProjects);
publicRouter.get("/projects/:slug", getProject);
publicRouter.get("/experience", listExperience);
publicRouter.get("/experience/:slug", getExperience);
publicRouter.get("/profile", getProfile);
