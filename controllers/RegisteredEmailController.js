import vine, { errors } from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { registeredEmailSchema } from "../validation/RegisteredEmailValidation.js";

class RegisteredEmailController {
  static async index(req, res) {
    try {
      const allEmails = await prisma.registeredemails.findMany({});
      if (allEmails) {
        return res.json({
          status: 200,
          data: allEmails,
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Can't fetch client data",
        errors: error.message,
      });
    }
  }
  static async show(req, res) {
    try {
      const userId = req.params.id;
      const emailData = await prisma.registeredemails.findMany({
        where: {
          user_id: userId,
        },
      });
      if (emailData) {
        res.status(200).json({
          message: "Emails Found",
          data: emailData,
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Bad Email request",
        error: error.message,
      });
    }
  }
  static async create(req, res) {
    try {
      const body = req.body;
      // const { email } = body;
      // // console.log(body);
      // const emailData = await prisma.registeredemails.findUnique({
      //   where: {
      //     email: email,
      //   },
      // });
      // // console.log(emailExists);
      // if (emailData) {
      //   console.log("Email Exists", emailExists);
      //   return res.status(409).json({
      //     message: "Email already exists",
      //   });
      // }
      const validator = vine.compile(registeredEmailSchema);
      const payload = await validator.validate(body);
      console.log("payload =====================", payload);

      const { data } = await prisma.registeredemails
        .create({
          data: payload,
        })
        .then((data) => {
          res.status(200).json({
            message: "Email saved",
            data: data,
          });
        })
        .catch((error) => {
          throw Error;
        });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.log(error.messages);
        res.status(400).json({
          message: error.messages[0].message,
        });
      }
    }
  }
  static async update(req, res) {}
  static async delete(req, res) {
    const emailId = req.params.id;
    try {
      await prisma.registeredemails
        .delete({
          where: {
            id: emailId,
          },
        })
        .then((data) => {
          res.status(200).json({
            message: "Email Deleted",
          });
        });
    } catch (error) {
      res.status(400).json({
        message: "Couldn't Delete Email",
        errors: error.message,
      });
    }
  }
  static async all(req, res) {
    const clients = await prisma.client.findMany({
      select: {
        clientEmail: true,
      },
    });
    const leads = await prisma.lead.findMany({
      select: {
        clientEmail: true,
      },
    });
    const all = [...clients, ...leads];
    res.status(200).json({
      data: all,
    });
  }
}

export default RegisteredEmailController;
