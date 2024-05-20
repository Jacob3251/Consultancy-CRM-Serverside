import { Router } from "express";
import SocialLinkController from "../controllers/SocialLinkController.js";

const router = Router();
router.get("/", SocialLinkController.index);
router.post("/", SocialLinkController.create);
router.put("/:id", SocialLinkController.update);
router.delete("/:id", SocialLinkController.delete);
export default router;
