import vine from "@vinejs/vine";
import { progressSchema } from "../validation/ProgressValidation.js";
import prisma from "../config/db.config.js";

class progressController {
  static async index(req, res) {
    const data = await prisma.progress.findMany({});

    res.status(200).json({
      message: "Progress Found",
      data: data,
    });
  }
  static async show(req, res) {
    try {
      const progressid = req.params.id;

      const found = await prisma.progress.findMany({
        where: {
          clientId: progressid,
        },
      });
      //   console.log(found);

      return res.status(200).json({
        message: "Data Fetched",
        data: found,
      });
    } catch (error) {
      res.status(400).json({
        message: "Bad Request",
        error: error.message,
      });
    }
  }
  static async create(req, res) {
    try {
      const body = req.body;
      console.log(body);
      const data = { report: body.report, clientId: body.clientId };
      console.log(data);
      const validation = vine.compile(progressSchema);
      const payload = await validation.validate(data);
      await prisma.progress
        .create({
          data: payload,
        })
        .then((data) => {
          return res.status(201).json({
            message: "Progress Added",
            data: data,
          });
        });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({
        message: "Bad Request",
        error: error.message,
      });
    }
  }
  static async update(req, res) {
    try {
      const progressId = req.params.id;
      const body = req.body;
      const validation = vine.compile(progressSchema);
      const payload = await validation.validate(body);

      const found = await prisma.progress.findUnique({
        where: {
          id: progressId,
        },
      });
      if (found) {
        await prisma.progress
          .update({
            data: payload,
            where: {
              id: progressId,
            },
          })
          .then((data) => {
            console.log(data);
            return res.status(200).json({
              message: "Progress Updated",
            });
          });
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
      const progressId = req.params.id;
      const found = await prisma.progress.findUnique({
        where: {
          id: progressId,
        },
      });
      if (found) {
        await prisma.progress
          .delete({
            where: {
              id: progressId,
            },
          })
          .then((data) => {
            return res.status(200).json({
              message: "Progress Deleted",
            });
          });
      } else {
        res.status(500).json({
          message: "Invalid Request",
        });
      }
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  }
}

export default progressController;
