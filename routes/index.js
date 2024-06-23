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
import EmailRoutes from "./emailRoutes.js";
import RegisteredEmailRoutes from "./registeredEmailRoutes.js";
import DashboarddataRoutes from "./dashboardDataRoutes.js";
import CustomPageRoutes from "./customPageRoutes.js";
import ProgressRoutes from "./progressRoutes.js";
import { sendEmail } from "../config/mailer.js";
import { uploadMultiple } from "../middleware/fileMiddleware.js";
import prisma from "../config/db.config.js";
import { generateDataArray } from "../utils/helper.js";
import { verifyPermission } from "../middleware/VerifyMiddleware.js";
import { permissionNames } from "../utils/configurations.js";
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
router.use("/api/email", EmailRoutes);
router.use("/api/registeredemails", RegisteredEmailRoutes);
router.use("/api/dashboarddata", DashboarddataRoutes);
router.use("/api/custompage", CustomPageRoutes);
router.use("/api/progress", ProgressRoutes);

// test mail route below
router.post(
  "/api/sendemail",
  verifyPermission(permissionNames.SEND_NEWSLETTERS.id),
  uploadMultiple.array("files", 10),
  async (req, res) => {
    const { from, to, subject, content } = req.body;
    console.log(req.body);
    const fromEmail = JSON.parse(from);
    // console.log("payload================", subject);
    const attachments = req.files;
    // console.log("body", req.body, attachments);
    const EmailData = await prisma.registeredemails.findFirst({
      where: {
        email: from.email,
      },
    });

    try {
      // from, to, subject, text, html, user, pass
      await sendEmail({
        from: from,
        to: to,
        subject,
        content,
        attachments,
        EmailData,
      });

      const attachmentData = attachments.map((file) => ({
        filename: file.originalname,
        path: file.path,
      }));

      const emailObject = {
        email_body: content,
        email_to: JSON.parse(to),
        email_from: fromEmail.email,
        email_subject: subject,
        email_attachments: JSON.stringify(attachmentData),
      };
      await prisma.email
        .create({
          data: emailObject,
        })
        .then((data) => {
          res.status(201).json({
            data: data,
            message: "Email Sent",
          });
        })
        .catch((error) => {
          console.log(error.message);
          throw Error;
        });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to send mail", error: error.message });
    }
  }
);

export default router;
