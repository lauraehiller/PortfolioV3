import { Schema, model, InferSchemaType } from "mongoose";

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      unique: true,
    },
    description: { type: String, default: "" },
    url: { type: String },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },
    isArchived: { type: Boolean, default: false, required: true },
    archivedOn: { type: Date },
  },
  { timestamps: true },
);

export type OrganizationData = InferSchemaType<typeof organizationSchema>;
export const Organization = model("Organization", organizationSchema);
