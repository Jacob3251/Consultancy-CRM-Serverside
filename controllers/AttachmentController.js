import vine from "@vinejs/vine";
import prisma from "../config/db.config.js";
import multer, { diskStorage } from "multer";
import { attachmentSchema } from "../validation/AttachmentValidation.js";
import { messages } from "@vinejs/vine/defaults";
import { removeFile } from "../utils/helper.js";
class AttachmentController {
  static async index(req, res) {
    try {
      const data = await prisma.attachments.findMany({});
      if (data) {
        res.status(200).json({
          message: "All Attachments Found",
          data: data,
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Attachments Not Found",
      });
    }
  }

  static async create(req, res) {
    try {
      const body = req.body;
      const file = req.file;
      if (!file) {
        throw Error;
      }

      const attachmentObj = {
        ...body,
        fileLink: req.file.path,
      };
      const validator = vine.compile(attachmentSchema);
      const payload = await validator.validate(attachmentObj);
      console.log("payload", payload);
      const data = await prisma.attachments.create({
        data: payload,
      });
      console.log("data", data);
      if (data) {
        res.status(201).json({
          message: "Attachment Inserted",
          data: data,
        });
      } else {
        removeFile(req.file.path);
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Attachment Not Uploaded",
        error: error.message,
      });
    }
  }
  static async show(req, res) {
    try {
      const attachmentId = req.params.id;
      const data = await prisma.attachments.findUnique({
        where: {
          id: attachmentId,
        },
      });

      if (data) {
        res.status(200).json({
          message: "Attachment Found",
          data: {
            ...data,
            fileLink: `http://localhost:5000/${data.fileLink.split("\\")[1]}`,
          },
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Attachment Not Uploaded",
        error: error.message,
      });
    }
  }
  static async delete(req, res) {
    try {
      const attachmentId = req.params.id;
      const data = await prisma.attachments.findUnique({
        where: {
          id: attachmentId,
        },
      });
      const removeFile = removeFile(data.fileLink);
      if (removeFile) {
        await prisma.attachments
          .delete({
            where: {
              id: attachmentId,
            },
          })
          .then(() =>
            res.status(200).json({
              message: "Attachment deleted",
            })
          );
      }
    } catch (error) {
      res.status(400).json({
        message: "Couldn't Delete Attachment",
        error: error.message,
      });
    }
  }
  static async download(req, res) {
    try {
      const attachmentId = req.params.id;
      const data = await prisma.attachments.findUnique({
        where: {
          id: attachmentId,
        },
      });

      if (data) {
        res.status(200).json({
          message: "Attachment Found",
          data: {
            fileLink: `${process.env.FILE_URL}/${data.fileLink.split("\\")[1]}`,
          },
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Couldn't Download Attachment",
        error: error.message,
      });
    }
  }
}

export default AttachmentController;
