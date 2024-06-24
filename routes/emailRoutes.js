import { Router } from "express";
import EmailController from "../controllers/EmailController.js";
import { verifyPermission } from "../middleware/VerifyMiddleware.js";
import { permissionNames } from "../utils/configurations.js";
const router = Router();

router.get(
  "/",
  // verifyPermission(permissionNames.SEND_NEWSLETTERS.id),
  EmailController.index
);
router.post(
  "/",
  // verifyPermission(permissionNames.SEND_NEWSLETTERS.id),
  EmailController.create
);
router.get(
  "/:id",
  // verifyPermission(permissionNames.SEND_NEWSLETTERS.id),
  EmailController.show
);
router.put(
  "/:id",
  // verifyPermission(permissionNames.SEND_NEWSLETTERS.id),
  EmailController.update
);
router.delete(
  "/:id",
  // verifyPermission(permissionNames.SEND_NEWSLETTERS.id),
  EmailController.delete
);

export default router;
