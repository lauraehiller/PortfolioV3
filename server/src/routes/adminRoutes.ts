import { Router } from "express";
import { ZodType } from "zod";
import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { passwordLimiter } from "../middleware/rateLimiters";
import {
  experienceController,
  organizationsController,
  projectsController,
} from "../controllers/adminControllers";
import {
  changePassword as changePasswordHandler,
  getOwnProfile,
  updateOwnProfile,
} from "../controllers/adminProfileController";
import {
  changePassword,
  experienceCreate,
  experienceUpdate,
  organizationCreate,
  organizationUpdate,
  profileUpdate,
  projectCreate,
  projectUpdate,
} from "../validation/schema";
import type { createCrudController } from "../controllers/crudFactory";

function crudRouter(
  c: ReturnType<typeof createCrudController>,
  schemas: { create: ZodType; update: ZodType },
  archivable = false,
) {
  const r = Router();
  r.get("/", c.list);
  r.post("/", validate(schemas.create), c.create);
  r.get("/:id", c.getOne);
  r.patch("/:id", validate(schemas.update), c.update);
  r.delete("/:id", c.remove);
  if (archivable) {
    r.post("/:id/archive", c.archive);
    r.post("/:id/unarchive", c.unarchive);
  }
  return r;
}

export const adminRouter = Router();

// Every route below this line requires a logged-in Admin.
adminRouter.use(requireAuth, requireRole("Admin"));

adminRouter.use(
  "/projects",
  crudRouter(projectsController, {
    create: projectCreate,
    update: projectUpdate,
  }),
);
adminRouter.use(
  "/experience",
  crudRouter(
    experienceController,
    { create: experienceCreate, update: experienceUpdate },
    true,
  ),
);
adminRouter.use(
  "/organizations",
  crudRouter(
    organizationsController,
    { create: organizationCreate, update: organizationUpdate },
    true,
  ),
);

adminRouter.get("/profile", getOwnProfile);
adminRouter.patch("/profile", validate(profileUpdate), updateOwnProfile);
adminRouter.put(
  "/password",
  passwordLimiter,
  validate(changePassword),
  changePasswordHandler,
);
