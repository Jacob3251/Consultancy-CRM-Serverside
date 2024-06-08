import vine from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { serviceExpertiseSchema } from "../validation/ServiceExpertiseValidation.js";

class ServiceExpertiseController {
  static async index(req, res) {
    try {
      const data = await prisma.serviceexpertise.findMany();
      if (data) {
        res.status(200).json({
          message: "Service Expertise Found",
          data: data,
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Service Expertise Not Found",
      });
    }
  }
  static async show(req, res) {
    try {
      const serviceExpertiseId = req.params.id;
      const data = await prisma.serviceexpertise.findUnique({
        where: {
          id: serviceExpertiseId,
        },
      });
      if (data) {
        res.status(200).json({
          message: "Service Expertise Found",
          data: data,
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Bad Request",
      });
    }
  }
  static async create(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(serviceExpertiseSchema);

      const payload = await validator.validate(body);

      await prisma.serviceexpertise
        .create({
          data: payload,
        })
        .then((data) => {
          return res.json({
            status: 200,
            message: "Service Created",
            data: data,
          });
        })
        .catch((error) => {
          throw Error;
        });
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  }
  static async update(req, res) {
    try {
      const serviceExpertiseId = req.params.id;
      const body = req.body;
      const validator = vine.compile(serviceExpertiseSchema);
      const payload = await validator.validate(body);
      const found = await prisma.serviceexpertise.findUnique({
        where: {
          id: serviceExpertiseId,
        },
      });
      if (found) {
        await prisma.serviceexpertise
          .update({
            data: payload,
            where: {
              id: serviceExpertiseId,
            },
          })
          .then((data) => {
            res.status(200).json({
              message: "Service Expertise updated",
              data: data,
            });
          });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Bad Request",
      });
    }
  }
  static async delete(req, res) {
    try {
      const serviceExpertiseId = req.params.id;
      await prisma.serviceexpertise
        .delete({
          where: {
            id: serviceExpertiseId,
          },
        })
        .then(() => {
          return res.status(200).json({
            message: "Service Expertise deleted",
          });
        });
    } catch (error) {
      return res.status(400).json({
        message: "Bad request",
      });
    }
  }
}

export default ServiceExpertiseController;
