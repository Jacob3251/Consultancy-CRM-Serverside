import vine from "@vinejs/vine";

export const emailSchema = vine.object({
  email_body: vine.string(),
  email_to: vine.array(vine.string()),
  email_from: vine.string(),
});
