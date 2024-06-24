import { Router } from "express";
import AttachmentController from "../controllers/AttachmentController.js";
import { uploadSingle } from "../middleware/fileMiddleware.js";
import { verifyPermission } from "../middleware/VerifyMiddleware.js";
import { permissionNames } from "../utils/configurations.js";

const router = Router();

router.get("/", AttachmentController.index);
router.post(
  "/",
  // verifyPermission(permissionNames.MODIFY_CLIENT.id),
  uploadSingle.single("file"),
  AttachmentController.create
);
router.get("/:id", AttachmentController.show);
router.put("/:id", uploadSingle.single("file"), AttachmentController.update);
router.get("/:id/download", AttachmentController.download);
router.delete(
  "/:id",
  // verifyPermission(permissionNames.MODIFY_CLIENT.id),
  AttachmentController.delete
);

export default router;
