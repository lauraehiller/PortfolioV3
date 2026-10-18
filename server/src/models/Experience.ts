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
    displayOrder: { type: Number, default: 0 },
    isArchived: { type: Boolean, default: false, required: true },
    archivedOn: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true },
);

experienceSchema.index({ status: 1, displayOrder: 1 });

export type experienceData = InferSchemaType<typeof experienceSchema>;
export const experience = model("experience", experienceSchema);
