import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "adil.liliputdg@gmail.com",
    pass: "qrio zcjc zyvs lfyi",
  },
});

const mailOptions = await transporter.sendMail({
  from: {
    name: "Md Adil",
    address: "adil.liliputdg@gmail.com",
  }, // sender address
  to: "zshakil2003@gmail.com", // list of receivers
  subject: "Hello vaia", // Subject line
  text: "vaia", // plain text body
  html: "<b>Hello world?</b>", // html body
});

export const sendMail = async (mailOptions) => {
  try {
    await transporter.sendMail();
  } catch (error) {
    console.log(error);
  }
};
