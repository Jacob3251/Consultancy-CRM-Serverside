import vine from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { servicePackageSchema } from "../validation/ServicePackageValidation.js";
import { removeFile } from "../utils/helper.js";
import { deleteFile, uploadFile } from "../utils/cloudinary.js";

class ServicePackageController {
  static async index(req, res) {
    try {
      const data = await prisma.servicepackage.findMany({});
      if (data) {
        res.status(200).json({
          message: "All Services Packages Found",
          data: data,
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Services Packages Not Found",
      });
    }
  }
  static async show(req, res) {
    try {
      const servicePackageId = req.params.id;
      const data = await prisma.servicepackage.findUnique({
        where: {
          id: servicePackageId,
        },
      });

      if (data) {
        res.status(200).json({
          message: "Service Package Found",
          data: data,
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Service Package Not Found",
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
      // console.log(req.file.path);
      const resultFile = await uploadFile(file.path);
      console.log("result file in cloudinary+++++++++++++++", resultFile);
      const convertedResultFile = JSON.stringify(resultFile);
      console.log("converted json++++++++++++++++++++", convertedResultFile);

      const servicePackageObject = {
        ...body,
        service_package_imageLink: resultFile.url,
        // storage_imagelink: resultFile ?? {},
      };
      console.log("servicePackageObject", servicePackageObject);
      const validator = vine.compile(servicePackageSchema);
      const payload = await validator.validate(servicePackageObject);
      console.log(payload);
      // res.status(200).json({
      //   message: "ServicePackage added",
      //   data: servicePackageObject,
      // });
      // console.log("payload", payload);
      const data = await prisma.servicepackage.create({
        data: { ...payload, storage_imagelink: convertedResultFile },
      });
      console.log("pushed data to db", data);
      if (data) {
        res.status(201).json({
          message: "Service Package Added",
          data: data,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "ServicePackage Not Added",
        error: error.message,
      });
    }
  }
  //   static async update(req, res) {}
  static async delete(req, res) {
    try {
      const servicePackageId = req.params.id;
      const data = await prisma.servicepackage.findUnique({
        where: {
          id: servicePackageId,
        },
      });
      const revertedFile = JSON.parse(data.storage_imagelink);
      console.log(revertedFile);
      try {
        deleteFile(revertedFile);
      } catch (deleteError) {
        console.error("Error deleting file:", deleteError);
        return res.status(500).json({
          message: "Error deleting file",
          error: deleteError.message,
        });
      }

      await prisma.servicepackage
        .delete({
          where: {
            id: servicePackageId,
          },
        })
        .then(() => {
          return res.status(200).json({
            message: "Service Package deleted",
          });
        });
    } catch (error) {
      res.status(400).json({
        message: "Couldn't Delete Service Package",
        error: error.message,
      });
    }
  }
}
export default ServicePackageController;
