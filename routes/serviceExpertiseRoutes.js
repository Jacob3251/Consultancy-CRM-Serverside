import { Router } from "express";
import ServiceExpertiseController from "../controllers/ServiceExpertiseController.js";
import { verifyPermission } from "../middleware/VerifyMiddleware.js";
import { permissionNames } from "../utils/configurations.js";

const router = Router();
router.get("/", ServiceExpertiseController.index);
router.post(
  "/",
  // verifyPermission(permissionNames.SITE_MODIFICATION.id),
  ServiceExpertiseController.create
);
router.get("/:id", ServiceExpertiseController.show);
router.put(
  "/:id",
  // verifyPermission(permissionNames.SITE_MODIFICATION.id),
  ServiceExpertiseController.update
);
router.delete(
  "/:id",
  // verifyPermission(permissionNames.SITE_MODIFICATION.id),
  ServiceExpertiseController.delete
);

export default router;
