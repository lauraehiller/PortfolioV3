import { createCrudController } from "./crudFactory";
import { Project } from "../models/Project";
import { Experience } from "../models/Experience";
import { Organization } from "../models/Organization";

export const projectsController = createCrudController(Project);

export const experienceController = createCrudController(Experience, {
  populate: { path: "organization", select: "name status isArchived" },
});

export const organizationsController = createCrudController(Organization, {
  sort: { name: 1 },
  beforeDelete: async (id) => {
    const count = await Experience.countDocuments({ organization: id });
    return count > 0
      ? `This organization is used by ${count} ${count === 1 ? "entity" : "entities"}. Archive it instead.`
      : null;
  },
});
