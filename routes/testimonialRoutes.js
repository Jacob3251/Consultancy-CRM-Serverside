import { Router } from "express";
import TestimonialController from "../controllers/TestimonialController.js";
import { uploadSingle } from "../middleware/fileMiddleware.js";
import { verifyPermission } from "../middleware/VerifyMiddleware.js";
import { permissionNames } from "../utils/configurations.js";

const router = Router();

router.get("/", TestimonialController.index);
router.post(
  "/",
  verifyPermission(permissionNames.MODIFY_TESTIMONIAL.id),
  uploadSingle.single("file"),
  TestimonialController.create
);
router.get("/:id", TestimonialController.show);
router.put(
  "/:id",
  verifyPermission(permissionNames.MODIFY_TESTIMONIAL.id),
  uploadSingle.single("file"),
  TestimonialController.update
);

router.delete(
  "/:id",
  verifyPermission(permissionNames.MODIFY_TESTIMONIAL.id),
  TestimonialController.delete
);

export default router;
