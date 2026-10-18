import { Schema, model, InferSchemaType } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    summary: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    liveUrl: { type: String },
    repoUrl: { type: String },
    isFeatured: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    images: { type: [Schema.Types.ObjectId], ref: "Image" },
    tools: { type: [String], default: [] },
    displayOrder: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false, required: true },
    archivedOn: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true },
);

projectSchema.index({ status: 1, displayOrder: 1 });

export type ProjectData = InferSchemaType<typeof projectSchema>;
export const Project = model("Project", projectSchema);
