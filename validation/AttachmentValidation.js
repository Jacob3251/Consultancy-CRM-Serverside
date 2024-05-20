import vine from "@vinejs/vine";

export const attachmentSchema = vine.object({
  title: vine.string(),
  desc: vine.string().optional(),
  fileLink: vine.string(),
  ownerId: vine.string(),
  type: vine.enum(["USER", "CLIENT", "LEADS"]),
});
