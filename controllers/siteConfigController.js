import vine from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { siteConfigSchema } from "../validation/SiteConfigValidation.js";

class siteConfigController {
  static async index(req, res) {
    try {
      const data = await prisma.siteconfig.findMany();
      if (data) {
        res.status(200).json({
          message: "Site Config Found",
          data: data,
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Site Config Not Found",
      });
    }
  }
  static async show(req, res) {
    try {
      const siteconfigId = req.params.id;
      const data = await prisma.siteconfig.findUnique({
        where: {
          id: siteconfigId,
        },
      });
      if (data) {
        res.status(200).json({
          message: "Site Config",
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
      const validator = vine.compile(siteConfigSchema);

      const payload = await validator.validate(body);

      const createdConfig = await prisma.siteconfig.create({
        data: payload,
      });

      return res.json({
        status: 200,
        message: "Site Config Created",
        data: createdConfig,
      });
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  }
  static async update(req, res) {
    try {
      const siteconfigId = req.params.id;
      const body = req.body;
      const validator = vine.compile(siteConfigSchema);
      const payload = await validator.validate(body);
      const found = await prisma.siteconfig.findUnique({
        where: {
          id: siteconfigId,
        },
      });
      if (found) {
        await prisma.siteconfig
          .update({
            data: payload,
            where: {
              id: siteconfigId,
            },
          })
          .then((data) => {
            res.status(200).json({
              message: "Site Config Updated",
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
      const siteconfigId = req.params.id;
      await prisma.siteconfig
        .delete({
          where: {
            id: siteconfigId,
          },
        })
        .then(() => {
          return res.status(200).json({
            message: "Site configuration deleted",
          });
        });
    } catch (error) {
      return res.status(400).json({
        message: "Bad request",
      });
    }
  }
}

export default siteConfigController;
