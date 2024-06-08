import { Router } from "express";
import RegisteredEmailController from "../controllers/RegisteredEmailController.js";
import { verifyPermission } from "../middleware/VerifyMiddleware.js";
import { permissionNames } from "../utils/configurations.js";
const router = Router();

router.get(
  "/",
  verifyPermission(permissionNames.MODIFY_EMAILS.id),
  RegisteredEmailController.index
);
router.post(
  "/",
  verifyPermission(permissionNames.MODIFY_EMAILS.id),
  RegisteredEmailController.create
);
// get request for getting all the client and the lead emails
router.get(
  "/party-email",
  verifyPermission(permissionNames.MODIFY_EMAILS.id),
  RegisteredEmailController.all
);
router.get(
  "/:id",
  verifyPermission(permissionNames.MODIFY_EMAILS.id),
  RegisteredEmailController.show
);
router.put(
  "/:id",
  verifyPermission(permissionNames.MODIFY_EMAILS.id),
  RegisteredEmailController.update
);
router.delete(
  "/:id",
  verifyPermission(permissionNames.MODIFY_EMAILS.id),
  RegisteredEmailController.delete
);

export default router;
