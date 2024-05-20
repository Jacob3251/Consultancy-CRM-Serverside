import vine from "@vinejs/vine";

export const clientSchema = vine.object({
  name: vine.string(),
  clientType: vine.enum(["VISIT", "STUDY", "IMMIGRATION", "OTHER"]).optional(),
  clientDesc: vine.string(),
  clientEmail: vine.string().optional(),
  phone_no: vine.string().minLength(11).maxLength(15),
  preferredDestination: vine.string(),
  recent_update: vine.string().optional(),
  dealAmount: vine.number().optional(),
  due: vine.number().optional(),
});
