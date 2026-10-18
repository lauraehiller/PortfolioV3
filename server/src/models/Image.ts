import { Schema, model, InferSchemaType } from "mongoose";

const imageSchema = new Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    url: { type: String, required: [true, "Url is required"] },
    altText: { type: String, required: [true, "Alt Text is required"] },
    caption: { type: String },
    isFeatured: { type: Boolean, required: true, default: false },
    isArchived: { type: Boolean, default: false, required: true },
    archivedOn: { type: Date },
  },
  { timestamps: true },
);

export type ImageData = InferSchemaType<typeof imageSchema>;
export const Image = model("Image", imageSchema);
