import { Router } from "express";
import SiteConfigController from "../controllers/siteConfigController.js";

const router = Router();
router.get("/", SiteConfigController.index);
router.post("/", SiteConfigController.create);
router.get("/:id", SiteConfigController.show);
router.put("/:id", SiteConfigController.update);
router.delete("/:id", SiteConfigController.delete);

export default router;
