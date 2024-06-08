import nodemailer from "nodemailer";

export const sendEmail = async ({
  from,
  to,
  subject,
  content,
  attachments,
  EmailData,
}) => {
  // console.log("from", from);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: EmailData.email,
      pass: EmailData.app_key,
    },
  });
  const mailOptions = {
    from: {
      name: from.name,
      address: from.email,
    },
    to,
    subject,
    text: content,
    html: `<b>${content}</b>`,
    attachments: attachments.map((file) => ({
      filename: file.originalname,
      path: file.path,
    })),
  };
  try {
    await transporter.sendMail(mailOptions, transporter);
    console.log("Mail sent successfully");
  } catch (error) {
    console.log("Error sending mail:", error);
    throw error;
  }
};
