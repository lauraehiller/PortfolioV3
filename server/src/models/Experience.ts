import { Schema, model, InferSchemaType } from "mongoose";

const experienceSchema = new Schema(
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
    startedOn: { type: Date, required: true },
    endedOn: { type: Date },
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
    displayOrder: { type: Number, required: true, default: 0 },
    isArchived: { type: Boolean, default: false, required: true },
    archivedOn: { type: Date },
  },
  { timestamps: true },
);

experienceSchema.index({ status: 1, displayOrder: 1 });

export type ExperienceData = InferSchemaType<typeof experienceSchema>;
export const Experience = model("Experience", experienceSchema);
