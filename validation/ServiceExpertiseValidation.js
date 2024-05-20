import vine from "@vinejs/vine";

export const serviceExpertiseSchema = vine.object({
  service_expertise_title: vine.string(),
  service_expertise_content: vine.string(),
});
