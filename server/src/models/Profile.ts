import { Schema, model, InferSchemaType } from "mongoose";

const profileSchema = new Schema(
  {
    // Account
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, "Username must be at least 5 characters long"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: ["Admin", "Viewer"],
      required: true,
      default: "Viewer",
    },

    // Public profile
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
    isArchived: { type: Boolean, default: false, required: true },
    archivedOn: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        const { password, ...safe } = ret;
        return safe;
      },
    },
  },
);

export type ProfileData = InferSchemaType<typeof profileSchema>;
export const Profile = model("Profile", profileSchema);
