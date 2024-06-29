import vine from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { testimonialSchema } from "../validation/TestimonialValidation.js";
import { removeFile } from "../utils/helper.js";
import { deleteFile, uploadFile } from "../utils/cloudinary.js";

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
      const resultFile = await uploadFile(file.path);
      // console.log(req.file.path);
      const testimonialObj = {
        ...body,

        client_imagelink: resultFile.url,
      };
      const validator = vine.compile(testimonialSchema);
      const payload = await validator.validate(testimonialObj);
      console.log("payload", payload);
      const stringified = JSON.stringify(resultFile);
      const data = await prisma.testimonial.create({
        data: { ...payload, storage_imagelink: stringified },
      });
      console.log("data", data);
      if (data) {
        res.status(201).json({
          message: "Testimonial Inserted",
          data: data,
        });
      } else {
        try {
          deleteFile(resultFile);
        } catch (deleteError) {
          console.error("Error deleting file:", deleteError);
          return res.status(500).json({
            message: "Error deleting file",
            error: deleteError.message,
          });
        }
      }
    } catch (error) {
      res.status(400).json({
        message: "Testimonial Not Added",
        error: error.message,
      });
    }
  }
  static async update(req, res) {
    try {
      const body = req.body;
      const testimonialId = req.params.id;
      const testimonialExists = await prisma.testimonial.findUnique({
        where: {
          id: testimonialId,
        },
      });
      if (!testimonialExists) {
        throw Error;
      }
      const file = req.file;
      if (!file) {
        const validator = vine.compile(testimonialSchema);
        const payload = await validator.validate(body);
        await prisma.testimonial
          .update({
            data: payload,
            where: {
              id: testimonialId,
            },
          })
          .then((data) => {
            return res.status(200).json({
              status: 200,
              message: `Review of ${data.client_name} updated successfully`,
              data: data,
            });
          })
          .catch((error) => {
            throw Error;
          });
      }
      if (file) {
        console.log("testimonialExists +++++++++++++", testimonialExists);
        const parsedStorage_link = JSON.parse(
          testimonialExists.storage_imagelink
        );
        console.log("Parsed previous storage link", parsedStorage_link);
        try {
          deleteFile(parsedStorage_link);
        } catch (deleteError) {
          console.error("Error deleting file:", deleteError);
          return res.status(500).json({
            message: "Error deleting file",
            error: deleteError.message,
          });
        }
        const resultFile = await uploadFile(file.path);
        const testimonialObj = {
          ...body,

          client_imagelink: resultFile.url,
        };
        const validator = vine.compile(testimonialSchema);
        const payload = await validator.validate(testimonialObj);
        console.log("payload", payload);
        const stringified = JSON.stringify(resultFile);
        const modified_payload = {
          ...payload,
          client_imagelink: resultFile.url,
          storage_imagelink: stringified,
        };
        console.log(modified_payload);
        const data = await prisma.testimonial.update({
          data: modified_payload,
          where: {
            id: testimonialId,
          },
        });
        console.log("updated data", data);
        if (data) {
          res.status(201).json({
            message: "Testimonial Inserted",
            data: data,
          });
        } else {
          deleteFile(resultFile);
          throw Error;
        }
      }
    } catch (error) {
      console.log(error.message);
      res.status(400).json({
        message: "Testimonial Not Added",
        error: error.message,
      });
    }
  }
  static async delete(req, res) {
    try {
      const testimonialId = req.params.id;
      const data = await prisma.testimonial.findUnique({
        where: {
          id: testimonialId,
        },
      });
      console.log(data);
      const parsedData = JSON.parse(data.storage_imagelink);
      console.log("delete testimonial", parsedData);

      try {
        deleteFile(parsedData);
      } catch (deleteError) {
        console.error("Error deleting file:", deleteError);
        return res.status(500).json({
          message: "Error deleting file",
          error: deleteError.message,
        });
      }
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
