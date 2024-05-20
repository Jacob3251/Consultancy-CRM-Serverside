import vine from "@vinejs/vine";

export const userSchma = vine.object({
  name: vine.string(),
  email: vine.string(),
  password: vine.string(),
  role: vine.string().optional(),
  verified: vine.boolean().optional(),
  contact_no: vine.string().optional(),
  photolink: vine.string().optional(),
});
