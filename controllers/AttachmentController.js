import vine, { errors } from "@vinejs/vine";
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
      const { title, desc, ownerId, type } = req.body;
      const file = req.file;
      if (!file) {
        throw Error;
      }

      const attachmentObj = {
        title,
        desc,
        ownerId,
        type,
        fileLink: req.file.path,
      };
      console.log(attachmentObj);
      const validator = vine.compile(attachmentSchema);
      const payload = await validator.validate(attachmentObj);
      console.log("payload", payload);
      const attachmentdata = await prisma.attachments.create({
        data: payload,
      });
      console.log("data", attachmentdata);
      if (attachmentdata) {
        res.status(201).json({
          message: "Attachment Inserted",
          data: attachmentdata,
        });
      } else {
        removeFile(req.file.path);
        throw Error;
      }
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        console.error("Validation Error:", error.messages);
        res.status(400).json({
          message: error.messages[0].message,
        });
      } else {
        console.error("Internal Server Error:", error);
        res.status(400).json({
          message: "Attachment Not Uploaded",
          error: error.message,
        });
      }
    }
  }
  static async update(req, res) {
    try {
      const id = req.params.id;
      const attachmentExists = await prisma.attachments.findUnique({
        where: {
          id: id,
        },
      });
      if (!attachmentExists) {
        throw Error;
      }

      removeFile(attachmentExists.fileLink);
      await prisma.attachments
        .update({
          data: {
            fileLink: req.file.path,
          },
          where: {
            id: id,
          },
        })
        .then((data) => {
          res.status(201).json({
            data: data,
          });
        });
    } catch (error) {
      res.status(500).json({
        message: "Attachment does not exist!!",
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
