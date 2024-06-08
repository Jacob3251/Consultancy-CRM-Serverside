import { Router } from "express";
import Sitemsgcontroller from "../controllers/Sitemsgcontroller.js";
import { verifyPermission } from "../middleware/VerifyMiddleware.js";
import { permissionNames } from "../utils/configurations.js";
const router = Router();

router.get(
  "/",
  verifyPermission(permissionNames.MODIFY_NOTIFICATION.id),
  Sitemsgcontroller.index
);
router.post("/", Sitemsgcontroller.create);
router.get("/:id", Sitemsgcontroller.show);
router.put(
  "/:id/update",
  verifyPermission(permissionNames.MODIFY_NOTIFICATION.id),
  Sitemsgcontroller.update
);
router.delete("/:id/delete", Sitemsgcontroller.delete);

export default router;
