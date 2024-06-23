import { messages } from "@vinejs/vine/defaults";
import prisma from "../config/db.config.js";
import { removeFile } from "../utils/helper.js";

class CustomPageController {
  static async index(req, res) {
    try {
      const customPages = await prisma.page.findMany({});
      if (customPages) {
        res.status(200).json({
          message: "custom page data",
          data: customPages,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal Error",
        error: error.message,
      });
    }
  }
  static async showByCategory(req, res) {
    const visitData = await prisma.page.findMany({
      where: {
        category: "VISIT",
      },
    });
    const studyData = await prisma.page.findMany({
      where: {
        category: "STUDY",
      },
    });
    const migrateData = await prisma.page.findMany({
      where: {
        category: "MIGRATE",
      },
    });
    const data = {
      visitData,
      studyData,
      migrateData,
    };
    res.status(200).json({
      message: "Data received",
      data: data,
    });
  }
  static async show(req, res) {
    try {
      const id = req.params.id;
      const customPageExists = await prisma.page.findUnique({
        where: {
          siteUrl: id,
        },
      });
      if (customPageExists) {
        res.status(200).json({
          message: "Custom Page Found",
          data: customPageExists,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
  static async create(req, res) {
    const file = req.files;
    const body = req.body;
    // const { files, ...rest } = body;
    const {
      title,
      category,
      siteUrl,
      metaTitle,
      pageData,
      metaDescription,
      metaKeywords,
    } = body;
    const newtitle = JSON.parse(title);
    const newcategory = JSON.parse(category);
    const newsiteUrl = JSON.parse(siteUrl);
    const newmetaTitle = JSON.parse(metaTitle);
    const newpageData = JSON.parse(pageData);
    const { pageHeading, pageDetail } = newpageData;
    const newmetaDescription = JSON.parse(metaDescription);
    const newmetaKeywords = JSON.parse(metaKeywords);
    console.log(req.files);
    try {
      const payload = {
        pageTitle: newtitle,
        pageData: JSON.stringify({
          ...newpageData,
          pageHeading: { ...pageHeading, banner: file[0].path },
          pageDetail: { ...pageDetail, images: [file[1].path, file[2].path] },
        }),
        siteUrl: newsiteUrl,
        category: newcategory,
        metaTitle: newmetaTitle,
        metaDiscription: newmetaDescription,
        metaKeywords: newmetaKeywords,
      };
      const pageExists = await prisma.page.findUnique({
        where: {
          siteUrl: siteUrl,
        },
      });

      if (pageExists) {
        file.map((item) => removeFile(item.file.path));
        return res.status(401).json({
          message: "Site with same url exists",
          error: error.message,
        });
      }

      await prisma.page
        .create({
          data: payload,
        })
        .then((data) => {
          res.status(201).json({
            message: "Page created",
            data: data,
          });
        })
        .catch((error) => {
          file.map((item) => removeFile(item.file.path));
          res.status(401).json({
            message: "Error while creating data",
            error: error.message,
          });
        });
    } catch (error) {
      res.status(500).json({
        message: "Internal Error",
        error: error.message,
      });
    }
    // console.log(req.body);
    // res.send({
    //   message: "data received",
    // });
  }
  static async update(req, res) {
    res.send({
      message: "data received",
    });
  }
  static async delete(req, res) {
    try {
      const id = req.params.id;
      const pageDatas = await prisma.page.findUnique({
        where: {
          id: id,
        },
      });
      if (pageDatas) {
        const page = JSON.parse(pageDatas.pageData);
        const bannerImage = page.pageHeading.banner;
        const blogImages = page.pageDetail.images;
        removeFile(bannerImage);
        blogImages.forEach((element) => {
          removeFile(element);
        });
        await prisma.page.delete({
          where: {
            id: id,
          },
        });
        res.status(200).json({
          message: "Page Deleted",
        });
      } else {
        res.status(500).json({
          message: "Internal Server Error",
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "data not received",
      });
    }
  }
}

export default CustomPageController;
