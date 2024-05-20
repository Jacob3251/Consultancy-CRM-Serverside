import vine from "@vinejs/vine";

export const socialLinkSchema = vine.object({
  fb_link: vine.string(),
  youtube_link: vine.string(),
  instagram_link: vine.string(),
});
