import prisma from "../config/db.config.js";

class SiteInformationController {
  static async index(req, res) {
    const siteConfig = await prisma.siteconfig.findMany();
    const socials = await prisma.sociallinks.findMany();
    const serviceExpertiseData = await prisma.serviceexpertise.findMany({});
    res.json({
      siteConfigs: siteConfig,
      socials: socials,
      serviceExpertiseData: serviceExpertiseData,
    });
  }
}

export default SiteInformationController;
