import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// for removing the file stored in the storage
export function removeFile(fileLocation) {
  return fs.unlinkSync(fileLocation);
}

// for hashing

export async function hasher(value) {
  const salt = await bcrypt.genSalt(10);
  const hashedValue = await bcrypt.hash(value, salt);
  return hashedValue;
}

// Token Generation

export function generateToken(data) {
  const { id, email } = data;
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}
