import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// for removing the file stored in the storage
export function removeFile(fileLocation) {
  console.log("render directory address", process.cwd());
  try {
    // Construct the full path
    const fullPath = path.join(process.cwd(), fileLocation);

    // Check if file exists before attempting to delete
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`File ${fileLocation} deleted successfully`);
    } else {
      console.log(`File ${fileLocation} does not exist, skipping deletion`);
    }
  } catch (error) {
    console.error(`Error handling file ${fileLocation}:`, error);
    // You might want to handle or log this error, but not throw it
  }
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
    expiresIn: "10d",
  });
}
export const passMatched = async (old_pass, new_pass) => {
  const matcher = await bcrypt.compare(old_pass, new_pass);
  return matcher;
};

export function generateDataArray(object1, object2) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Combine data from both objects
  const combinedData = [...object1, ...object2];

  const clientData = months.map((month) => ({
    name: month,
    Clients: 0,
  }));

  const leadData = months.map((month) => ({
    name: month,
    Leads: 0,
  }));

  object1.forEach((item) => {
    const date = new Date(item.created_at);
    const monthName = months[date.getMonth()]; // Get month name from date

    // Find the corresponding month in the result array
    const monthData = clientData.find((data) => data.name === monthName);

    // Increment Clients and Leads count
    if (monthData) {
      monthData.Clients += 1;
    }
  });

  object2.forEach((item) => {
    const date = new Date(item.created_at);
    const monthName = months[date.getMonth()]; // Get month name from date

    // Find the corresponding month in the result array
    const monthData = leadData.find((data) => data.name === monthName);

    // Increment Clients and Leads count
    if (monthData) {
      monthData.Leads += 1;
    }
  });

  // Initialize the result array with months
  const result = months.map((month) => ({
    name: month,
    Clients: clientData.find((item) => item.name === month).Clients,
    Leads: leadData.find((item) => item.name === month).Leads,
  }));

  // combinedData.forEach((item) => {
  //   const date = new Date(item.created_at);
  //   const monthName = months[date.getMonth()]; // Get month name from date

  //   // Find the corresponding month in the result array
  //   const monthData = result.find((data) => data.name === monthName);

  //   // Increment Clients and Leads count
  //   if (monthData) {
  //     monthData.Clients += 1;
  //     monthData.Leads += 1; // Assuming each client is also a lead
  //   }
  // });

  return result;
}
