import { Router } from "express";
import ServicePackageController from "../controllers/ServicePackageController.js";
import { upload } from "../middleware/fileMiddleware.js";

const router = Router();

router.get("/", ServicePackageController.index);
router.post("/", upload.single("file"), ServicePackageController.create);
router.get("/:id", ServicePackageController.show);
// router.get("/:id/download", TestimonialController.download);

router.delete("/:id", ServicePackageController.delete);

export default router;
