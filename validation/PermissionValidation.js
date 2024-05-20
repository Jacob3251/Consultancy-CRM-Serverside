import vine from "@vinejs/vine";

export const permissionSchema = vine.object({
  title: vine.string().maxLength(50),
  desc: vine.string(),
});
