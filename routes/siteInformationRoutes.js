import { Router } from "express";
import SiteConfigController from "../controllers/SiteInformationController.js";

const router = Router();
router.get("/", SiteConfigController.index);

export default router;
