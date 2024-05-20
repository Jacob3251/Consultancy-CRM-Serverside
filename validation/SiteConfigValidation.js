import vine from "@vinejs/vine";

export const siteConfigSchema = vine.object({
  home_banner: vine.string().maxLength(24).optional(),
  home_sub_banner: vine.string().maxLength(50).optional(),
  cta_title: vine.string().optional(),
  cta_sub_title: vine.string().optional(),
  services_banner: vine.string().optional(),
  services_sub_banner: vine.string().optional(),
  services_banner_content: vine.string().optional(),
  uk_office_address: vine.string().optional(),
  uk_office_cell: vine.string().optional(),
  bd_corporate_address: vine.string().optional(),
  bd_corporate_cell: vine.string().optional(),
  bd_legal_address: vine.string().optional(),
  bd_legal_cell: vine.string().optional(),
});
