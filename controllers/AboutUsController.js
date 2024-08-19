import prisma from "../config/db.config.js";

class AboutUsController {
  static async index(req, res) {
    try {
      const aboutus = await prisma.aboutUs.findFirst();
      if (aboutus) {
        res.status(200).json({
          data: aboutus,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "Data not found",
      });
    }
  }
  static async update(req, res) {
    try {
      const found = await prisma.aboutUs.findFirst();
      const body = req.body;
      // if there is data
      if (found) {
        await prisma.aboutUs
          .update({
            data: body,
            where: {
              id: found.id,
            },
          })
          .then((data) => {
            res.status(200).json({
              message: "Page Updated",
              data: data,
            });
          });
      } else {
        await prisma.aboutUs
          .create({
            data: body,
          })
          .then((data) => {
            res.status(200).json({
              message: "Page Updated",
              data: data,
            });
          });
      }
    } catch (error) {
      res.status(400).json({
        message: "Internal Server Error",
      });
    }
  }
}

export default AboutUsController;
