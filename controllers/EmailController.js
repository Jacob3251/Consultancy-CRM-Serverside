import vine, { errors } from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { emailSchema } from "../validation/EmailValidation.js";
import { removeFile } from "../utils/helper.js";
import { deleteFile } from "../utils/cloudinary.js";

class EmailController {
  static async index(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      if (page <= 0) {
        page = 1;
      }
      if (limit <= 0 || limit > 100) {
        limit = 10;
      }

      const skip = (page - 1) * limit;
      const allEmails = await prisma.email.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          date: "desc",
        },
      });
      const totalRoles = await prisma.email.count();
      const totalPages = Math.ceil(totalRoles / limit);
      return res.json({
        status: 200,
        data: allEmails,
        metadata: {
          totalPages,
          currentPage: page,
          currentLimit: limit,
        },
      });
    } catch (error) {
      res.status(400).json({
        message: "Can't fetch client data",
        errors: error.message,
      });
    }
  }
  static async show(req, res) {
    try {
      const emailId = req.params.id;
      const emailData = await prisma.email.findUnique({
        where: {
          id: emailId,
        },
      });
      if (emailData) {
        res.status(200).json({
          message: "Email Found",
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
      console.log(body);
      const validator = vine.compile(emailSchema);
      const payload = await validator.validate(body);
      console.log("payload =====================", payload);

      const { data } = await prisma.email
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
      const email = await prisma.email.findUnique({
        where: {
          id: emailId,
        },
      });
      if (email) {
        const emailAttachments = JSON.parse(email.email_attachments);
        console.log(emailAttachments);
        if (emailAttachments.length > 0) {
          for (let i = 0; i < emailAttachments.length; i++) {
            try {
              deleteFile(emailAttachments[i]);
            } catch (deleteError) {
              console.error("Error deleting file:", deleteError);
              return res.status(500).json({
                message: "Error deleting file",
                error: deleteError.message,
              });
            }
          }
        }
        await prisma.email
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
      }
    } catch (error) {
      res.status(400).json({
        message: "Couldn't Delete Email",
        errors: error.message,
      });
    }
  }
}

export default EmailController;
