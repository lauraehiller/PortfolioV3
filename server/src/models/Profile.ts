import { Schema, model, InferSchemaType } from "mongoose";

const profileSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last Name is required"],
      trim: true,
    },
    headline: { type: String, default: "" },
    bio: { type: String, default: "" },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\s*[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}\s*$/,
        "Please fill a valid email address",
      ],
    },
    avatarUrl: { type: String, default: "default-avatar.png" },
    resumeUrl: { type: String },
    socials: {
      type: [
        {
          label: { type: String, required: true },
          url: { type: String, required: true },
          icon: { type: String },
        },
      ],
      default: [],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isArchived: { type: Boolean, default: false, required: true },
    archivedOn: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true },
);

export type ProfileData = InferSchemaType<typeof profileSchema>;
export const Profile = model("Profile", profileSchema);
