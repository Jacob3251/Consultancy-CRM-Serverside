import prisma from "../config/db.config.js";

class SiteInformationController {
  static async index(req, res) {
    // console.log(prisma);
    const siteConfig = await prisma.siteconfig.findMany();
    const socials = await prisma.sociallinks.findMany();
    const serviceExpertiseData = await prisma.serviceexpertise.findMany({});
    const visitData = await prisma.customPage.findMany({
      where: {
        category: "VISIT",
      },
    });
    const studyData = await prisma.customPage.findMany({
      where: {
        category: "STUDY",
      },
    });
    const migrateData = await prisma.customPage.findMany({
      where: {
        category: "MIGRATE",
      },
    });
    const data = {
      visitData,
      studyData,
      migrateData,
    };
    res.json({
      siteConfigs: siteConfig,
      socials: socials,
      serviceExpertiseData: serviceExpertiseData,
      blogPageData: data,
    });
  }
}

export default SiteInformationController;
