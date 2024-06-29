import vine from "@vinejs/vine";

export const leadSchema = vine.object({
  name: vine.string(),
  clientType: vine.enum(["VISIT", "STUDY", "IMMIGRATION", "OTHER"]).optional(),
  clientDesc: vine.string().optional(),
  clientEmail: vine.string().optional(),
  lead_address: vine.string().optional(),
  phone_no: vine.string().minLength(11).maxLength(15),
  preferredDestination: vine.string().optional(),
  dealAmount: vine.number().optional(),
  due: vine.number().optional(),
  recent_udpate: vine.string().optional(),
});
