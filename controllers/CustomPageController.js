import { messages } from "@vinejs/vine/defaults";
import prisma from "../config/db.config.js";
import { cloudRestrictor, removeFile } from "../utils/helper.js";
import cloudinary, { deleteFile, uploadFile } from "../utils/cloudinary.js";

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
        const parsedData = JSON.parse(customPageExists.pageData);
        // console.log("parsed", parsedData);
        const modifiedData = {
          ...parsedData,
          pageHeading: {
            title: parsedData.pageHeading.title,
            description: parsedData.pageHeading.description,
            banner: cloudRestrictor(parsedData.pageHeading.banner),
          },
          pageDetail: {
            title: parsedData.pageDetail.title,
            description: parsedData.pageDetail.description,
            images: [
              cloudRestrictor(parsedData.pageDetail.images[0]),
              cloudRestrictor(parsedData.pageDetail.images[1]),
            ],
          },
        };
        // console.log("modified", modifiedData);
        res.status(200).json({
          message: "Custom Page Found",
          data: { ...customPageExists, pageData: modifiedData },
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
    console.log(file);
    const body = req.body;
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
    // console.log(req.files);
    const result = await uploadFile(file[0]?.path);
    const result1 = await uploadFile(file[1]?.path);
    const result2 = await uploadFile(file[2]?.path);

    try {
      const payload = {
        pageTitle: newtitle,
        pageData: JSON.stringify({
          ...newpageData,
          pageHeading: {
            ...pageHeading,
            banner: { fileLink: result.url, fileInfo: { ...result } },
          },
          pageDetail: {
            ...pageDetail,
            images: [
              { fileLink: result1.url, fileInfo: { ...result1 } },
              { fileLink: result2.url, fileInfo: { ...result2 } },
            ],
          },
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
        // file.map((item) => removeFile(item.file.path));
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
          // file.map((item) => removeFile(item.file.path));
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
    try {
      const id = req.params.id;
      const body = req.body;
      const file = req.files;
      // finding out the existing data
      const customPageExists = await prisma.page.findUnique({
        where: {
          siteUrl: id,
        },
      });

      if (!customPageExists) {
        return res.status(400).json({
          message: "Invalid request",
        });
      }
      // setting out the pageId for using when updating the page information
      const pageId = customPageExists.id;

      const parsedPageData = JSON.parse(customPageExists.pageData);

      console.log(file);
      const {
        title,
        category,
        siteUrl,
        metaTitle,
        pageData,
        metaDescription,
        metaKeywords,
      } = body;

      // for only data change **********************************
      let temp;
      if (file.length === 0) {
        const newtitle = JSON.parse(title);
        const newcategory = JSON.parse(category);
        const newsiteUrl = JSON.parse(siteUrl);
        const newmetaTitle = JSON.parse(metaTitle);
        const newpageData = JSON.parse(pageData);
        const { pageHeading, pageDetail } = newpageData;
        const newmetaDescription = JSON.parse(metaDescription);
        const newmetaKeywords = JSON.parse(metaKeywords);

        const payload = {
          pageTitle: newtitle,
          pageData: JSON.stringify({
            ...newpageData,
            pageHeading: {
              ...pageHeading,
              banner: parsedPageData.pageHeading.banner,
            },
            pageDetail: {
              ...pageDetail,
              images: parsedPageData.pageDetail.images,
            },
          }),
          siteUrl: newsiteUrl,
          category: newcategory,
          metaTitle: newmetaTitle,
          metaDiscription: newmetaDescription,
          metaKeywords: newmetaKeywords,
        };
        console.log(payload);

        await prisma.page
          .update({
            data: payload,
            where: {
              id: pageId,
            },
          })
          .then((data) => {
            console.log("page updated");
          });
        temp = JSON.parse(payload.pageData);
      }

      if (file.length > 0) {
        // for images
        // firstly deleting the previously existing images
        try {
          if (file.length === 3) {
            deleteFile(parsedPageData.pageHeading.banner.fileInfo);
            deleteFile(parsedPageData.pageDetail.images[0].fileInfo);
            deleteFile(parsedPageData.pageDetail.images[1].fileInfo);
          } else if (file.length === 2) {
            deleteFile(parsedPageData.pageDetail.images[0].fileInfo);
            deleteFile(parsedPageData.pageDetail.images[1].fileInfo);
          } else {
            deleteFile(parsedPageData.pageHeading.banner.fileInfo);
          }
        } catch (deleteError) {
          console.error("Error deleting file:", deleteError);
          return res.status(500).json({
            message: "Error deleting file",
            error: deleteError.message,
          });
        }
        // adding the new images
        let resultArr = [];
        if (file.length === 3) {
          const bannerResult = await uploadFile(file[0]?.path);
          const detailImageResult1 = await uploadFile(file[1]?.path);
          const detailImageResult2 = await uploadFile(file[2]?.path);
          resultArr.push(bannerResult, detailImageResult1, detailImageResult2);
        } else if (file.length === 2) {
          const detailImageResult1 = await uploadFile(file[0]?.path);
          const detailImageResult2 = await uploadFile(file[1]?.path);
          resultArr.push(detailImageResult1, detailImageResult2);
        } else {
          const bannerResult = await uploadFile(file[0]?.path);
          resultArr.push(bannerResult);
        }
        // setting the new updated payload with banner image details
        const newtitle = JSON.parse(title);
        const newcategory = JSON.parse(category);
        const newsiteUrl = JSON.parse(siteUrl);
        const newmetaTitle = JSON.parse(metaTitle);
        const newpageData = JSON.parse(pageData);
        const { pageHeading, pageDetail } = newpageData;
        const newmetaDescription = JSON.parse(metaDescription);
        const newmetaKeywords = JSON.parse(metaKeywords);

        const payload = {
          pageTitle: newtitle,
          pageData: JSON.stringify({
            ...newpageData,
            pageHeading: {
              ...pageHeading,
              banner: {
                fileLink:
                  resultArr.length === 2
                    ? parsedPageData.pageHeading.banner.fileLink
                    : resultArr[0].url,
                fileInfo:
                  resultArr.length === 2
                    ? { ...parsedPageData.pageHeading.banner.fileInfo }
                    : {
                        ...resultArr[0],
                      },
              },
            },
            pageDetail: {
              ...pageDetail,
              images:
                resultArr.length === 3
                  ? [
                      {
                        fileLink: resultArr[1].url,
                        fileInfo: { ...resultArr[1] },
                      },
                      {
                        fileLink: resultArr[2].url,
                        fileInfo: { ...resultArr[2] },
                      },
                    ]
                  : resultArr.length === 2
                  ? [
                      {
                        fileLink: resultArr[0].url,
                        fileInfo: { ...resultArr[0] },
                      },
                      {
                        fileLink: resultArr[1].url,
                        fileInfo: { ...resultArr[1] },
                      },
                    ]
                  : parsedPageData.pageDetail.images,
            },
          }),
          siteUrl: newsiteUrl,
          category: newcategory,
          metaTitle: newmetaTitle,
          metaDiscription: newmetaDescription,
          metaKeywords: newmetaKeywords,
        };

        // updating the data

        await prisma.page
          .update({
            data: payload,
            where: {
              id: pageId,
            },
          })
          .then((data) => {
            console.log("page updated");
          });
        temp = JSON.parse(payload.pageData);
      }

      // const { pageData, ...rest } = customPageExists;
      // const parsedPageData = JSON.parse(pageData);

      // console.log("body", body);

      res.send({
        message: "page update route",
        // data: rest ?? undefined,
        parsedPageData: temp,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
  static async delete(req, res) {
    try {
      const id = req.params.id;
      // console.log("page delete id+++++++++++++", id);
      const pageDatas = await prisma.page.findUnique({
        where: {
          id: id,
        },
      });
      // console.log("delete controller page++++++++++++", pageDatas);
      if (pageDatas) {
        const page = JSON.parse(pageDatas.pageData);
        console.log("delete controller page++++++++++++", page);
        console.log(page.pageHeading.banner.fileInfo);
        try {
          deleteFile(page.pageHeading.banner.fileInfo);
          deleteFile(page.pageDetail.images[0].fileInfo);
          deleteFile(page.pageDetail.images[1].fileInfo);
        } catch (deleteError) {
          console.error("Error deleting file:", deleteError);
          return res.status(500).json({
            message: "Error deleting file",
            error: deleteError.message,
          });
        }
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
      console.log(error.message);
      res.status(400).json({
        message: "data not received",
        error: error.message,
      });
    }
  }
}

export default CustomPageController;
