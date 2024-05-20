import vine from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { homeServiceSchema } from "../validation/HomeServiceValidation.js";

class HomeServiceController {
  static async index(req, res) {
    try {
      const data = await prisma.homeservice.findMany();
      if (data) {
        res.status(200).json({
          message: "Home Services Found",
          data: data,
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Home Services Not Found Bad Request",
      });
    }
  }
  static async show(req, res) {
    try {
      const homeServiceId = req.params.id;
      const data = await prisma.homeservice.findUnique({
        where: {
          id: homeServiceId,
        },
      });
      if (data) {
        res.status(200).json({
          message: "Home Service Found",
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
      console.log(body);
      const validator = vine.compile(homeServiceSchema);

      const payload = await validator.validate(body);

      const createdHomeService = await prisma.homeservice.create({
        data: payload,
      });

      return res.json({
        status: 200,
        message: "Home service Created",
        data: createdHomeService,
      });
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  }
  static async update(req, res) {
    try {
      const homeServiceId = req.params.id;
      const body = req.body;
      const validator = vine.compile(homeServiceSchema);
      const payload = await validator.validate(body);
      console.log(payload);

      const found = await prisma.homeservice.findUnique({
        where: {
          id: homeServiceId,
        },
      });
      if (found) {
        console.log(found);
        await prisma.homeservice
          .update({
            data: payload,
            where: {
              id: homeServiceId,
            },
          })
          .then((data) => {
            res.status(200).json({
              message: "Home Service updated",
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
      const homeServiceId = req.params.id;
      await prisma.homeservice
        .delete({
          where: {
            id: homeServiceId,
          },
        })
        .then(() => {
          return res.status(200).json({
            message: "Home Service deleted",
          });
        });
    } catch (error) {
      return res.status(400).json({
        message: "Bad request",
      });
    }
  }
}

export default HomeServiceController;
