import { z } from "zod";

function isHttpUrl(value: string) {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

const text = (max: number) => z.string().trim().max(max);
const status = z.enum(["Draft", "Published"]);
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(100)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers, and hyphens",
  );
const httpUrl = z.string().trim().refine(isHttpUrl, "Must be an http(s) URL");
const optionalUrl = z.union([httpUrl, z.literal("")]); // "" clears the field
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid id");
const displayOrder = z.number().int().min(0).max(100000);

export const projectCreate = z.object({
  title: text(200).min(1),
  slug,
  summary: text(500).min(1),
  description: z.string().max(20000).optional(),
  skills: z.array(text(50).min(1)).max(30).optional(),
  liveUrl: optionalUrl.optional(),
  repoUrl: optionalUrl.optional(),
  imageUrl: optionalUrl.optional(),
  displayOrder: displayOrder.optional(),
  status: status.optional(),
});
export const projectUpdate = projectCreate.partial();

export const experienceCreate = z.object({
  title: text(200).min(1),
  slug,
  summary: text(500).optional(),
  description: z.string().max(20000).optional(),
  isFeatured: z.boolean().optional(),
  status: status.optional(),
  organization: z
    .union([objectId, z.literal(""), z.null()])
    .transform((v) => v || null)
    .optional(),
  displayOrder: displayOrder.optional(),
});
export const experienceUpdate = experienceCreate.partial();

export const organizationCreate = z.object({
  name: text(200).min(1),
  description: z.string().max(5000).optional(),
  url: optionalUrl.optional(),
  status: status.optional(),
});
export const organizationUpdate = organizationCreate.partial();

export const profileUpdate = z
  .object({
    name: text(100).min(1),
    headline: text(200),
    bio: z.string().max(5000),
    email: z.union([z.string().trim().email(), z.literal("")]),
    location: text(100),
    avatarUrl: optionalUrl,
    resumeUrl: optionalUrl,
    socials: z
      .array(z.object({ label: text(50).min(1), url: httpUrl }))
      .max(20),
  })
  .partial();

export const changePassword = z
  .object({
    currentPassword: z.string().min(1).max(200),
    newPassword: z
      .string()
      .min(12, "Use at least 12 characters")
      .max(72, "Use at most 72 characters"),
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "New password must be different",
    path: ["newPassword"],
  });
