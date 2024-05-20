import vine from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { testimonialSchema } from "../validation/TestimonialValidation.js";
import { removeFile } from "../utils/helper.js";

class TestimonialController {
  static async index(req, res) {
    try {
      const data = await prisma.testimonial.findMany({});
      if (data) {
        res.status(200).json({
          message: "All Testimonials Found",
          data: data,
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Testimonials Not Found",
      });
    }
  }
  static async show(req, res) {
    try {
      const testimonialId = req.params.id;
      const data = await prisma.testimonial.findUnique({
        where: {
          id: testimonialId,
        },
      });

      if (data) {
        res.status(200).json({
          message: "Testimonial Found",
          data: {
            ...data,
          },
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Testimonial Not Found",
        error: error.message,
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
      console.log(req.file.path);
      const testimonialObj = {
        ...body,

        client_imagelink: `http://localhost:5000/${
          req.file.path.split("\\")[1]
        }`,
      };
      const validator = vine.compile(testimonialSchema);
      const payload = await validator.validate(testimonialObj);
      console.log("payload", payload);
      const data = await prisma.testimonial.create({
        data: { ...payload, storage_imagelink: req.file.path },
      });
      console.log("data", data);
      if (data) {
        res.status(201).json({
          message: "Testimonial Inserted",
          data: data,
        });
      } else {
        removeFile(req.file.path);
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Testimonial Not Added",
        error: error.message,
      });
    }
  }
  //   static async update(req, res) {
  //     try {
  //       const attachmentId = req.params.id;
  //       const data = await prisma.attachments.findUnique({
  //         where: {
  //           id: attachmentId,
  //         },
  //       });

  //       if (data) {
  //         res.status(200).json({
  //           message: "Attachment Found",
  //           data: {
  //             ...data,
  //             fileLink: `http://localhost:5000/${data.fileLink.split("\\")[1]}`,
  //           },
  //         });
  //       } else {
  //         throw Error;
  //       }
  //     } catch (error) {
  //       res.status(400).json({
  //         message: "Attachment Not Uploaded",
  //         error: error.message,
  //       });
  //     }
  //   }
  static async delete(req, res) {
    try {
      const testimonialId = req.params.id;
      const data = await prisma.testimonial.findUnique({
        where: {
          id: testimonialId,
        },
      });
      console.log(data);
      removeFile(data.storage_imagelink);

      await prisma.testimonial
        .delete({
          where: {
            id: testimonialId,
          },
        })
        .then(() => {
          return res.status(200).json({
            message: "Testimonial deleted",
          });
        });
    } catch (error) {
      res.status(400).json({
        message: "Couldn't Delete Testimonial",
        error: error.message,
      });
    }
  }
}

export default TestimonialController;
