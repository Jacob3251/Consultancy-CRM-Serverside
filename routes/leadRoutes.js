import { Router } from "express";
import LeadController from "../controllers/LeadController.js";
import { verifyPermission } from "../middleware/VerifyMiddleware.js";
import { permissionNames } from "../utils/configurations.js";
import { uploadSingle } from "../middleware/fileMiddleware.js";

const router = Router();

router.get(
  "/",
  // verifyPermission(permissionNames.VIEW_LEADS.id),
  LeadController.index
);
router.post(
  "/",
  // verifyPermission(permissionNames.MODIFY_LEAD.id),
  uploadSingle.single("file"),
  LeadController.create
);
router.get(
  "/:id",
  // verifyPermission(permissionNames.VIEW_LEADS.id),
  LeadController.show
);
router.put(
  "/:id/update",
  // verifyPermission(permissionNames.MODIFY_LEAD.id),
  uploadSingle.single("file"),
  LeadController.update
);
router.delete(
  "/:id/delete",
  // verifyPermission(permissionNames.MODIFY_LEAD.id),
  LeadController.delete
);

export default router;
