import vine from "@vinejs/vine";

export const querySchema = vine.object({
  name: vine.string(),
  email: vine.string(),
  phone_no: vine.string(),
  message: vine.string(),
  reply: vine.string().optional(),
  status: vine.enum(["Answered", "Pending"]).optional(),
});
