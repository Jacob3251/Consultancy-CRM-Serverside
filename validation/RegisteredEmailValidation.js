import vine from "@vinejs/vine";

export const registeredEmailSchema = vine.object({
  email: vine.string(),
  app_key: vine.string(),
  user_id: vine.string(),
});
