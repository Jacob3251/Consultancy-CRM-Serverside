import vine from "@vinejs/vine";

export const roleSchema = vine.object({
  title: vine.string().minLength(3).maxLength(30),
  permissions: vine.array(vine.string()),
});
