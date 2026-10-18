import { Schema, model, InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 5 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\s*[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,4}\s*$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Excludes password by default when querying users
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      required: true,
      default: "User",
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    isArchived: { type: Boolean, default: false, required: true },
    archivedOn: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: true,
  },
);

export type UserData = InferSchemaType<typeof userSchema>;
export const User = model("User", userSchema);
