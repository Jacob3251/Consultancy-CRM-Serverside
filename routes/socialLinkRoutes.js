import { Router } from "express";
import SocialLinkController from "../controllers/SocialLinkController.js";
import { verifyPermission } from "../middleware/VerifyMiddleware.js";
import { permissionNames } from "../utils/configurations.js";

const router = Router();
router.get("/", SocialLinkController.index);
router.post(
  "/",
  verifyPermission(permissionNames.SITE_MODIFICATION.id),
  SocialLinkController.create
);
router.put(
  "/:id",
  verifyPermission(permissionNames.SITE_MODIFICATION.id),
  SocialLinkController.update
);
router.delete(
  "/:id",
  verifyPermission(permissionNames.SITE_MODIFICATION.id),
  SocialLinkController.delete
);
export default router;
