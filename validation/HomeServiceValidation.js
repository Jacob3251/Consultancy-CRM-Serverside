import vine from "@vinejs/vine";

export const homeServiceSchema = vine.object({
  home_service_title: vine.string(),
  home_service_category: vine.enum(["VISIT", "STUDY", "MIGRATION"]),
  home_service_site_link: vine.string(),
});
