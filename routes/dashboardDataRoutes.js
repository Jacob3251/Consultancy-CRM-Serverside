import { Router } from "express";
import prisma from "../config/db.config.js";
import { generateDataArray } from "../utils/helper.js";
import { verifyPermission } from "../middleware/VerifyMiddleware.js";
import { permissionNames } from "../utils/configurations.js";
const router = Router();

router.get(
  "/",
  // verifyPermission(permissionNames.VIEW_DASHBOARD_DATA.id),
  async (req, res) => {
    const clients = await prisma.client.findMany();
    const leads = await prisma.lead.findMany();
    const unresolvedQuery = await prisma.sitemsgquery.findMany({
      where: {
        status: "Pending",
      },
    });
    const resolvedQuery = await prisma.sitemsgquery.findMany({
      where: {
        status: "Answered",
      },
    });
    const testimonial = await prisma.testimonial.findMany({});
    const data = {
      totalClients: clients.length,
      totalLeads: leads.length,
      totalUnresolved: unresolvedQuery.length,
      totalResolved: resolvedQuery.length,
      totalReviews: testimonial.length,
      clientvsmonth: generateDataArray(clients, leads),
    };

    res.status(200).json({
      message: "Data Received",
      data: data,
    });
  }
);
export default router;
