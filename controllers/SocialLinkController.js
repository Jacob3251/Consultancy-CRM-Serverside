import vine from "@vinejs/vine";
import prisma from "../config/db.config.js";
import { socialLinkSchema } from "../validation/SocialLinkValidation.js";

class SocialLinkController {
  static async index(req, res) {
    try {
      const data = await prisma.sociallinks.findMany();
      if (data) {
        res.status(200).json({
          message: "social links Found",
          data: data,
        });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "social links Not Found",
      });
    }
  }

  static async create(req, res) {
    const body = req.body;
    console.log(body);
    try {
      const validator = vine.compile(socialLinkSchema);

      const payload = await validator.validate(body);

      const createdSocials = await prisma.sociallinks.create({
        data: payload,
      });

      return res.json({
        status: 200,
        message: "Social Links Created",
        data: createdSocials,
      });
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  }
  static async update(req, res) {
    try {
      const socialsId = req.params.id;
      console.log("-----------------------", socialsId);
      const body = req.body;
      const validator = vine.compile(socialLinkSchema);
      const payload = await validator.validate(body);
      const found = await prisma.sociallinks.findUnique({
        where: {
          id: socialsId,
        },
      });
      console.log("++++++++++++++++++++++", found);
      if (found) {
        await prisma.sociallinks
          .update({
            data: payload,
            where: {
              id: socialsId,
            },
          })
          .then((data) => {
            res.status(200).json({
              message: "Socials updated",
              data: data,
            });
          });
      } else {
        throw Error;
      }
    } catch (error) {
      res.status(400).json({
        message: "Bad Request",
        error: error.message,
      });
    }
  }
  static async delete(req, res) {
    try {
      const socialsId = req.params.id;
      await prisma.sociallinks
        .delete({
          where: {
            id: socialsId,
          },
        })
        .then(() => {
          return res.status(200).json({
            message: "Socials deleted",
          });
        });
    } catch (error) {
      return res.status(400).json({
        message: "Bad request",
      });
    }
  }
}

export default SocialLinkController;
