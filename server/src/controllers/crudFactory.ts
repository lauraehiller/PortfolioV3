import { Request, Response } from "express";
import { Model, PopulateOptions, SortOrder, isValidObjectId } from "mongoose";

interface CrudOptions {
  sort?: Record<string, SortOrder>;
  populate?: PopulateOptions;
  /** Return a message to block the delete (409), or null to allow it. */
  beforeDelete?: (id: string) => Promise<string | null>;
}

export function createCrudController(
  Model: Model<any>,
  options: CrudOptions = {},
) {
  const sort = options.sort ?? { displayOrder: 1, createdAt: -1 };
  const populate = options.populate ? [options.populate] : [];

  const getId = (req: Request) => String(req.params.id);
  const badId = (res: Response) => {
    res.status(400).json({ message: "Invalid id" });
  };
  const notFound = (res: Response) => {
    res.status(404).json({ message: "Not found" });
  };

  return {
    list: async (_req: Request, res: Response) => {
      const docs = await Model.find()
        .select("-__v")
        .populate(populate)
        .sort(sort)
        .lean();
      res.json(docs);
    },

    getOne: async (req: Request, res: Response) => {
      const id = getId(req);
      if (!isValidObjectId(id)) return badId(res);

      const doc = await Model.findById(id)
        .select("-__v")
        .populate(populate)
        .lean();
      if (!doc) return notFound(res);
      res.json(doc);
    },

    create: async (req: Request, res: Response) => {
      const doc = await Model.create(req.body);
      res.status(201).json(doc);
    },

    update: async (req: Request, res: Response) => {
      const id = getId(req);
      if (!isValidObjectId(id)) return badId(res);
      if (Object.keys(req.body).length === 0) {
        res.status(400).json({ message: "No valid fields to update" });
        return;
      }

      const doc = await Model.findByIdAndUpdate(
        id,
        { $set: req.body },
        { new: true, runValidators: true },
      )
        .select("-__v")
        .populate(populate)
        .lean();
      if (!doc) return notFound(res);
      res.json(doc);
    },

    remove: async (req: Request, res: Response) => {
      const id = getId(req);
      if (!isValidObjectId(id)) return badId(res);

      const blocked = await options.beforeDelete?.(id);
      if (blocked) {
        res.status(409).json({ message: blocked });
        return;
      }

      const doc = await Model.findByIdAndDelete(id);
      if (!doc) return notFound(res);
      res.status(204).end();
    },

    archive: async (req: Request, res: Response) => {
      const id = getId(req);
      if (!isValidObjectId(id)) return badId(res);

      const doc = await Model.findByIdAndUpdate(
        id,
        { $set: { isArchived: true, archivedOn: new Date() } },
        { new: true },
      ).lean();
      if (!doc) return notFound(res);
      res.json(doc);
    },

    unarchive: async (req: Request, res: Response) => {
      const id = getId(req);
      if (!isValidObjectId(id)) return badId(res);

      const doc = await Model.findByIdAndUpdate(
        id,
        { $set: { isArchived: false }, $unset: { archivedOn: 1 } },
        { new: true },
      ).lean();
      if (!doc) return notFound(res);
      res.json(doc);
    },
  };
}
