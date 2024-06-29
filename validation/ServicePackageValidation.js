import vine from "@vinejs/vine";

export const servicePackageSchema = vine.object({
  service_package_title: vine.string(),
  service_package_content: vine.string(),
  service_package_imageLink: vine.string(),
  // storage_imagelink: vine.object(),
});
