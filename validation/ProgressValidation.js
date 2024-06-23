import vine from "@vinejs/vine";

export const progressSchema = vine.object({
  report: vine.string(),
  clientId: vine.string(),
});
