import vine from "@vinejs/vine";

export const testimonialSchema = vine.object({
  client_name: vine.string(),
  client_address: vine.string(),
  client_rating: vine.number(),
  client_review: vine.string(),
  client_imagelink: vine.string(),
});
