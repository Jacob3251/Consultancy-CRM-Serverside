import { Router } from "express";
import TestimonialController from "../controllers/TestimonialController.js";
import { upload } from "../middleware/fileMiddleware.js";

const router = Router();

router.get("/", TestimonialController.index);
router.post("/", upload.single("file"), TestimonialController.create);
router.get("/:id", TestimonialController.show);
// router.get("/:id/download", TestimonialController.download);

router.delete("/:id", TestimonialController.delete);

export default router;
