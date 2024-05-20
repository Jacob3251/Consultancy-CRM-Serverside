import { Router } from "express";
import TeamMemberController from "../controllers/TeamMemberController.js";
import { upload } from "../middleware/fileMiddleware.js";

const router = Router();

router.get("/", TeamMemberController.index);
router.post("/", upload.single("file"), TeamMemberController.create);
router.get("/:id", TeamMemberController.show);
// router.get("/:id/download", TestimonialController.download);

router.delete("/:id", TeamMemberController.delete);

export default router;
