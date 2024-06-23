import prisma from "../config/db.config.js";

class SiteInformationController {
  static async index(req, res) {
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
      visitData: visitData ?? null,
      studyData: studyData ?? null,
      migrateData: migrateData ?? null,
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
