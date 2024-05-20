import vine from "@vinejs/vine";

export const teamMemberSchema = vine.object({
  member_name: vine.string(),
  member_position: vine.string(),
  member_imagelink: vine.string(),
  storage_imagelink: vine.string(),
});
