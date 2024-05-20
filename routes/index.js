import { Router } from "express";
import UserRoutes from "./userRoutes.js";
import PermissionRoutes from "./permissionRoutes.js";
import RoleRoutes from "./roleRoutes.js";
import LeadRoutes from "./leadRoutes.js";
import ClientRoutes from "./clientRoutes.js";
import AttachmentRoutes from "./attachmentRoutes.js";
import TransactionRoutes from "./transactionRoutes.js";
import SiteMsgQueryRoutes from "./siteMessageRoutes.js";
import SocialLinkRoutes from "./socialLinkRoutes.js";
import HomeServiceRoutes from "./homeServiceRoutes.js";
import SiteConfigRoutes from "./siteConfigRoutes.js";
import TestimonialRoutes from "./testimonialRoutes.js";
import ServiceExpertiseRoutes from "./serviceExpertiseRoutes.js";
import ServicePackagesRoutes from "./servicePackageRoutes.js";
import TeamMemberRoutes from "./teamMemberRoutes.js";
import SiteInformationRoutes from "./siteInformationRoutes.js";
import { sendMail } from "../config/mailer.js";
const router = Router();

router.use("/api/user", UserRoutes);
router.use("/api/permission", PermissionRoutes);
router.use("/api/role", RoleRoutes);
router.use("/api/lead", LeadRoutes);
router.use("/api/client", ClientRoutes);
router.use("/api/attachment", AttachmentRoutes);
router.use("/api/transaction", TransactionRoutes);
router.use("/api/querymsg", SiteMsgQueryRoutes);
router.use("/api/sociallinks", SocialLinkRoutes);
router.use("/api/homeservice", HomeServiceRoutes);
router.use("/api/siteconfig", SiteConfigRoutes);
router.use("/api/testimonial", TestimonialRoutes);
router.use("/api/serviceexpertise", ServiceExpertiseRoutes);
router.use("/api/servicepackage", ServicePackagesRoutes);
router.use("/api/teammember", TeamMemberRoutes);
router.use("/api/siteInformation", SiteInformationRoutes);
// test mail route below
router.get("/email", async (req, res) => {
  await sendMail();
  res.json({
    message: "Mail Sent",
  });
});

export default router;
