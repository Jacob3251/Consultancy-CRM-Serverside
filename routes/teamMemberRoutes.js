import { Router } from "express";
import TeamMemberController from "../controllers/TeamMemberController.js";
import { uploadSingle } from "../middleware/fileMiddleware.js";
import { verifyPermission } from "../middleware/VerifyMiddleware.js";
import { permissionNames } from "../utils/configurations.js";

const router = Router();

router.get("/", TeamMemberController.index);
router.post(
  "/",
  verifyPermission(permissionNames.SITE_MODIFICATION.id),
  uploadSingle.single("file"),
  TeamMemberController.create
);
router.get("/:id", TeamMemberController.show);
// router.get("/:id/download", TestimonialController.download);

router.delete(
  "/:id",
  verifyPermission(permissionNames.SITE_MODIFICATION.id),
  TeamMemberController.delete
);

export default router;
