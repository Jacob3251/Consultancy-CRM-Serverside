import { Router } from "express";
import AttachmentController from "../controllers/AttachmentController.js";
import { upload } from "../middleware/fileMiddleware.js";

const router = Router();

router.get("/", AttachmentController.index);
router.post("/", upload.single("file"), AttachmentController.create);
router.get("/:id", AttachmentController.show);
router.get("/:id/download", AttachmentController.download);

router.delete("/:id", AttachmentController.delete);

export default router;
