import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
export async function uploadFile(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    // console.log("Upload result:", result);
    // Now you can use result outside the cloudinary.uploader.upload function
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Error uploading file");
  }
}

export const deleteFile = (file) => {
  console.log("file from delete", file);
  return new Promise((resolve, reject) => {
    const { public_id, resource_type } = file;

    cloudinary.uploader.destroy(
      public_id,
      { resource_type: resource_type },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export default cloudinary;
